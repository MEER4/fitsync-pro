import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';

@Injectable()
export class ExercisesService {
    constructor(private prisma: PrismaService) { }

    async create(coachId: string, data: CreateExerciseDto) {
        return this.prisma.exercises.create({
            data: {
                ...data,
                coach_id: coachId,
            },
        });
    }

    async findAll(coachId: string) {
        return this.prisma.exercises.findMany({
            where: {
                coach_id: coachId,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
    }
}
