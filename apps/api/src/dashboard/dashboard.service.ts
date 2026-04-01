import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats(userId: string) {
        // First, get the user's role to determine if admin
        const user = await this.prisma.profiles.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        
        const isAdmin = user?.role === 'admin' as any;

        // 1. Active Athletes (Members) - Count members directly from profiles.coach_id
        // Admin sees ALL members, coach sees only their members
        const activeAthletes = await this.prisma.profiles.count({
            where: {
                role: 'member',
                ...(isAdmin ? {} : { coach_id: userId } as any)
            }
        });

        // 2. Completion Rate
        const totalAssignments = await this.prisma.assignments.count({
            where: isAdmin ? {} : { coach_id: userId }
        });

        const completedAssignments = await this.prisma.assignments.count({
            where: {
                ...(isAdmin ? {} : { coach_id: userId }),
                status: 'completed'
            }
        });

        const completionRate = totalAssignments > 0
            ? Math.round((completedAssignments / totalAssignments) * 100)
            : 0;

        // 3. Monthly Revenue (Simulated - for future membership implementation)
        const monthlyRevenue = activeAthletes * 50;

        // 4. Active Routines (created by this coach, or all for admin)
        const activeRoutines = await this.prisma.routines.count({
            where: isAdmin ? {} : { coach_id: userId }
        });

        // 5. Pending Assignments
        const pendingAssignments = await this.prisma.assignments.count({
            where: {
                ...(isAdmin ? {} : { coach_id: userId }),
                status: { in: ['pending', 'in_progress'] }
            }
        });

        return {
            activeAthletes,
            completionRate,
            monthlyRevenue,
            activeRoutines,
            pendingAssignments
        };
    }

    async getRecentActivity(userId: string) {
        // Get user role
        const user = await this.prisma.profiles.findUnique({
            where: { id: userId },
            select: { role: true }
        });
        
        const isAdmin = user?.role === 'admin' as any;

        // Fetch last 5 assignments with updates
        const recent = await this.prisma.assignments.findMany({
            where: isAdmin ? {} : { coach_id: userId },
            take: 5,
            orderBy: { created_at: 'desc' },
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

        const profile = await this.prisma.profiles.findUnique({
            where: { id: memberId },
            select: { weekly_goal: true }
        });

        const weeklyGoal = profile?.weekly_goal || 3;

        return {
            completedWorkouts,
            weeklyGoal,
            percentage: Math.min(Math.round((completedWorkouts / weeklyGoal) * 100), 100)
        };
    }


}
