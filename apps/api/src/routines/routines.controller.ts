import { Controller, Get, Post, Put, Body, UseGuards, Request, Param } from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('routines')
@UseGuards(SupabaseAuthGuard)
export class RoutinesController {
    constructor(private readonly routinesService: RoutinesService) { }

    @Post()
    create(@Request() req, @Body() createRoutineDto: CreateRoutineDto) {
        return this.routinesService.create(req.user.sub, createRoutineDto);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateRoutineDto: CreateRoutineDto) {
        return this.routinesService.update(id, updateRoutineDto);
    }

    @Get()
    findAll(@Request() req) {
        return this.routinesService.findAll(req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.routinesService.findOne(id);
    }
}
