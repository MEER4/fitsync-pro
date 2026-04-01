import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class AssignmentsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async getMemberAssignments(memberId: string) {
        return this.prisma.assignments.findMany({
            where: {
                member_id: memberId,
                status: {
                    in: ['pending', 'in_progress', 'missed', 'completed']
                },
            },
            include: {
                routine: {
                    include: {
                        items: {
                            include: {
                                exercise: true
                            },
                            orderBy: {
                                order_index: 'asc'
                            }
                        }
                    }
                },
                coach: {
                    select: {
                        full_name: true,
                        avatar_url: true
                    }
                }
            },
            orderBy: {
                scheduled_date: 'asc'
            }
        });
    }

    async getAssignmentsByMember(memberId: string) {
        return this.prisma.assignments.findMany({
            where: {
                member_id: memberId,
            },
            include: {
                routine: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                scheduled_date: 'desc' // Most recent first
            }
        });
    }

    async completeAssignment(assignmentId: string, memberId: string, feedback?: string) {
        // 1. Verify ownership
        const assignment = await this.prisma.assignments.findUnique({
            where: { id: assignmentId }
        });

        if (!assignment) {
            throw new NotFoundException('Assignment not found');
        }

        if (assignment.member_id !== memberId) {
            throw new ForbiddenException('You can only complete your own assignments');
        }

        // 2. Update
        return this.prisma.assignments.update({
            where: { id: assignmentId },
            data: {
                status: 'completed',
                completed_date: new Date(),
                feedback_notes: feedback
            }
        });
    }

    async assignRoutine(coachId: string, memberId: string, routineId: string, scheduledDate: Date) {
        // Validate that the member belongs to this coach (unless admin)
        const coach = await this.prisma.profiles.findUnique({
            where: { id: coachId },
            select: { role: true }
        });

        const isAdmin = coach?.role === 'admin' as any;

        if (!isAdmin) {
            const member = await this.prisma.profiles.findUnique({
                where: { id: memberId }
            });

            const memberCoachId = (member as any)?.coach_id;
            if (memberCoachId && memberCoachId !== coachId) {
                throw new ForbiddenException('This member belongs to another coach');
            }

            // If member has no coach_id, assign them to this coach
            if (!memberCoachId) {
                await this.prisma.$executeRawUnsafe(
                    `UPDATE profiles SET coach_id = $1 WHERE id = $2`,
                    coachId, memberId
                );
            }
        }

        const assignment = await this.prisma.assignments.create({
            data: {
                coach_id: coachId,
                member_id: memberId,
                routine_id: routineId,
                status: 'pending',
                scheduled_date: scheduledDate
            },
            include: {
                routine: { select: { name: true } },
                coach: { select: { full_name: true } }
            }
        });

        // Send Push Notification
        const coachName = assignment.coach?.full_name || 'Tu coach';
        const routineName = assignment.routine?.name || 'una nueva rutina';

        await this.notificationsService.sendNotification(memberId, {
            title: '¡Nueva rutina asignada!',
            body: `${coachName} te ha asignado ${routineName}.`,
            url: '/dashboard/calendar'
        });

        return assignment;
    }
}
