import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('exercises')
@UseGuards(SupabaseAuthGuard)
export class ExercisesController {
    constructor(private readonly exercisesService: ExercisesService) { }

    @Post()
    create(@Request() req, @Body() createExerciseDto: CreateExerciseDto) {
        return this.exercisesService.create(req.user.sub, createExerciseDto);
    }

    @Get()
    async findAll(@Request() req) {
        console.log('GET /exercises - User:', req.user);
        try {
            return await this.exercisesService.findAll(req.user.sub);
        } catch (e) {
            console.error('ERROR in GET /exercises:', e);
            throw e;
        }
    }

    @Post('seed')
    async seed(@Request() req) {
        console.log('POST /exercises/seed - User:', req.user);
        try {
            return await this.exercisesService.seed(req.user.sub);
        } catch (e) {
            console.error('ERROR in POST /exercises/seed:', e);
            throw e;
        }
    }
}
