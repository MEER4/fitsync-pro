import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('dashboard')
@UseGuards(SupabaseAuthGuard)
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    async getStats(@Request() req: any) {
        const userId = req.user.sub;
        return this.dashboardService.getStats(userId);
    }

    @Get('recent-activity')
    async getRecentActivity(@Request() req: any) {
        const userId = req.user.sub;
        return this.dashboardService.getRecentActivity(userId);
    }
}
