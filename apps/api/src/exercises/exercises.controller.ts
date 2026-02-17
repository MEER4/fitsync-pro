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
    findAll(@Request() req) {
        return this.exercisesService.findAll(req.user.sub);
    }
}
