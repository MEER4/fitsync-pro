import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
    constructor(private prisma: PrismaService) { }

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
        return this.prisma.assignments.create({
            data: {
                coach_id: coachId,
                member_id: memberId,
                routine_id: routineId,
                status: 'pending',
                scheduled_date: scheduledDate
            }
        });
    }
}
