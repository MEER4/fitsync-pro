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

    async seed(coachId: string) {
        const defaults = [
            { title: 'Push-ups', description: 'Standard push-up', video_source: 'youtube', video_url: 'https://youtu.be/IODxDxX7oi4' },
            { title: 'Squats', description: 'Bodyweight squat', video_source: 'youtube', video_url: 'https://youtu.be/YaXPRqUwItQ' },
            { title: 'Lunges', description: 'Walking lunges', video_source: 'youtube', video_url: 'https://youtu.be/L8fvybPrzzs' },
            { title: 'Plank', description: 'Forearm plank', video_source: 'youtube', video_url: 'https://youtu.be/pSHjTRCQxIw' },
            { title: 'Burpees', description: 'Full body burpee', video_source: 'youtube', video_url: 'https://youtu.be/auBLPXO8FfU' },
        ];

        return Promise.all(defaults.map(ex => this.create(coachId, ex as any)));
    }
}
