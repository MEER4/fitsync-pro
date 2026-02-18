import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
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

    @Get()
    findAll(@Request() req) {
        return this.routinesService.findAll(req.user.sub);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.routinesService.findOne(id);
    }
}
