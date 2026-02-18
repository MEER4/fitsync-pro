import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('assignments')
@UseGuards(SupabaseAuthGuard)
export class AssignmentsController {
    constructor(private readonly assignmentsService: AssignmentsService) { }

    @Get('my-assignments')
    async getMyAssignments(@Request() req: any) {
        const userId = req.user.sub;
        return this.assignmentsService.getMemberAssignments(userId);
    }

    @Patch(':id/complete')
    async completeAssignment(
        @Param('id') id: string,
        @Body('feedback') feedback: string,
        @Request() req: any
    ) {
        const userId = req.user.sub;
        return this.assignmentsService.completeAssignment(id, userId, feedback);
    }
}
