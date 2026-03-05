import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    // Public endpoint - no auth required (form submission from landing page)
    @Post()
    async create(@Body() body: {
        full_name: string;
        email: string;
        phone?: string;
        age?: string;
        weight?: string;
        height?: string;
        gender?: string;
        goal?: string;
        plan?: string;
        experience_level?: string;
        availability?: string;
        medical_conditions?: string;
        contact_preference?: string;
    }) {
        // For now, assign to first coach or null (can be improved later)
        return this.leadsService.create(body);
    }

    // Protected - coach only
    @UseGuards(SupabaseAuthGuard)
    @Get()
    async findAll(@Req() req: any) {
        return this.leadsService.findAllByCoach(req.user.sub);
    }

    @UseGuards(SupabaseAuthGuard)
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('status') status: string,
        @Req() req: any,
    ) {
        return this.leadsService.updateStatus(id, status, req.user.sub);
    }

    @UseGuards(SupabaseAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: any) {
        return this.leadsService.delete(id, req.user.sub);
    }
}
