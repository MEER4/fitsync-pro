import { Controller, Post, Get, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto';

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    // Public endpoint - no auth required (form submission from landing page)
    @Post()
    async create(@Body() createLeadDto: CreateLeadDto) {
        // For now, assign to first coach or null (can be improved later)
        return this.leadsService.create(createLeadDto);
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
        @Body() updateLeadStatusDto: UpdateLeadStatusDto,
        @Req() req: any,
    ) {
        return this.leadsService.updateStatus(id, updateLeadStatusDto.status, req.user.sub);
    }

    @UseGuards(SupabaseAuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: any) {
        return this.leadsService.delete(id, req.user.sub);
    }
}
