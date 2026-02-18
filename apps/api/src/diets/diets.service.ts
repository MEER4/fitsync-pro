import { Injectable } from '@nestjs/common';
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
