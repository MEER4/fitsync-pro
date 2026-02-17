import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoutineDto } from './dto/create-routine.dto';

@Injectable()
export class RoutinesService {
    constructor(private prisma: PrismaService) { }

    async create(coachId: string, data: CreateRoutineDto) {
        const { items, ...routineData } = data;

        return this.prisma.routines.create({
            data: {
                ...routineData,
                coach_id: coachId,
                items: {
                    create: items.map((item) => ({
                        ...item,
                    })),
                },
            },
            include: {
                items: true,
            },
        });
    }

    async findAll(coachId: string) {
        return this.prisma.routines.findMany({
            where: {
                coach_id: coachId,
            },
            include: {
                items: {
                    include: {
                        exercise: true
                    },
                    orderBy: {
                        order_index: 'asc'
                    }
                }
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
}
