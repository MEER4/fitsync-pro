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
}
