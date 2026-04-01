import { Controller, Get, Patch, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { AssignRoutineDto } from './dto/assign-routine.dto';
import { CompleteAssignmentDto } from './dto/complete-assignment.dto';

@Controller('assignments')
@UseGuards(SupabaseAuthGuard)
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @Get('my-assignments')
    async getMyAssignments(@Request() req: any) {
        const userId = req.user.sub;
        return this.assignmentsService.getMemberAssignments(userId);
    }

    @Get('member/:memberId')
    async getAssignmentsByMember(@Param('memberId') memberId: string) {
        return this.assignmentsService.getAssignmentsByMember(memberId);
    }

    @Patch(':id/complete')
    async completeAssignment(
        @Param('id') id: string,
        @Body() completeAssignmentDto: CompleteAssignmentDto,
        @Request() req: any
    ) {
        const userId = req.user.sub;
        return this.assignmentsService.completeAssignment(id, userId, completeAssignmentDto.feedback);
    }
    @Post()
    async assignRoutine(
        @Body() assignRoutineDto: AssignRoutineDto,
        @Request() req: any
    ) {
        const coachId = req.user.sub;
        return this.assignmentsService.assignRoutine(
            coachId, 
            assignRoutineDto.memberId, 
            assignRoutineDto.routineId, 
            new Date(assignRoutineDto.scheduledDate)
        );
    }
}
