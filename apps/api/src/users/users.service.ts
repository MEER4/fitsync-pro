import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getMembers() {
        return this.prisma.profiles.findMany({
            where: {
                role: 'member',
            },
            select: {
                id: true,
                full_name: true,
                email: true,
                avatar_url: true,
                role: true,
            },
            orderBy: {
                full_name: 'asc',
            },
        });
    }

    async getMember(memberId: string) {
        return this.prisma.profiles.findUnique({
            where: { id: memberId },
            select: {
                id: true,
                full_name: true,
                email: true,
                avatar_url: true,
                role: true,
                created_at: true,
            },
        });
    }

    async removeMember(memberId: string) {
        // Delete related assignments first
        await this.prisma.assignments.deleteMany({
            where: { member_id: memberId },
        });
        // Delete profile
        await this.prisma.profiles.delete({
            where: { id: memberId },
        });
        return { success: true };
    }
}
