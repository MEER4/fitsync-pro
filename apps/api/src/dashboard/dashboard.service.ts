import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats(coachId: string) {
        // 1. Active Athletes (Members)
        // In a real app, 'active' might mean they have a subscription or recent activity.
        // For now, we'll count all members.
        const activeAthletes = await this.prisma.profiles.count({
            where: {
                role: 'member'
            }
        });

        // 2. Completion Rate
        // (Completed Assignments / Total Assignments) * 100
        const totalAssignments = await this.prisma.assignments.count({
            where: { coach_id: coachId }
        });

        const completedAssignments = await this.prisma.assignments.count({
            where: {
                coach_id: coachId,
                status: 'completed'
            }
        });

        const completionRate = totalAssignments > 0
            ? Math.round((completedAssignments / totalAssignments) * 100)
            : 0;

        // 3. Monthly Revenue (Simulated)
        // Assuming $50/month per active athlete
        const monthlyRevenue = activeAthletes * 50;

        return {
            activeAthletes,
            completionRate,
            monthlyRevenue
        };
    }

    async getRecentActivity(coachId: string) {
        // Fetch last 5 assignments with updates
        const recent = await this.prisma.assignments.findMany({
            where: { coach_id: coachId },
            take: 5,
            orderBy: { created_at: 'desc' }, // Or completed_at if available and preferred
            include: {
                member: {
                    select: {
                        full_name: true,
                        avatar_url: true
                    }
                },
                routine: {
                    select: {
                        name: true
                    }
                }
            }
        });

        return recent.map(r => ({
            id: r.id,
            athleteName: r.member?.full_name || 'Unknown',
            athleteAvatar: r.member?.avatar_url,
            status: r.status,
            routineName: r.routine?.name || 'Deleted Routine',
            date: r.completed_date || r.created_at
        }));
    }

    async getMemberStats(memberId: string) {
        const now = new Date();
        // Calculate start of the week (Monday)
        const startOfWeek = new Date(now);
        const day = startOfWeek.getDay() || 7; // Get current day number, converting Sun (0) to 7
        if (day !== 1) startOfWeek.setHours(-24 * (day - 1));
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        // Count completed workouts describing to this week
        const completedWorkouts = await this.prisma.assignments.count({
            where: {
                member_id: memberId,
                status: 'completed',
                completed_date: {
                    gte: startOfWeek,
                    lte: endOfWeek
                }
            }
        });

        // Hardcoded goal for now - could be moved to profile later
        const weeklyGoal = 4;

        return {
            completedWorkouts,
            weeklyGoal,
            percentage: Math.min(Math.round((completedWorkouts / weeklyGoal) * 100), 100)
        };
    }


}
