import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DietsService {
    constructor(private prisma: PrismaService) { }

    async getDiet(memberId: string) {
        return this.prisma.diets.findUnique({
            where: { member_id: memberId }
        });
    }

    async upsertDiet(data: { memberId: string; coachId: string; content: any; name?: string }) {
        // Validate that the member belongs to this coach (unless admin)
        const coach = await this.prisma.profiles.findUnique({
            where: { id: data.coachId },
            select: { role: true }
        });

        const isAdmin = coach?.role === 'admin' as any;

        if (!isAdmin) {
            const member = await this.prisma.profiles.findUnique({
                where: { id: data.memberId }
            });

            const memberCoachId = (member as any)?.coach_id;
            if (memberCoachId && memberCoachId !== data.coachId) {
                throw new ForbiddenException('This member belongs to another coach');
            }

            // If member has no coach_id, assign them to this coach
            if (!memberCoachId) {
                await this.prisma.$executeRawUnsafe(
                    `UPDATE profiles SET coach_id = $1 WHERE id = $2`,
                    data.coachId, data.memberId
                );
            }
        }

        return this.prisma.diets.upsert({
            where: { member_id: data.memberId },
            update: {
                content: data.content,
                name: data.name,
                coach_id: data.coachId
            },
            create: {
                member_id: data.memberId,
                coach_id: data.coachId,
                content: data.content,
                name: data.name || 'Weekly Plan'
            }
        });
    }
}
