import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { DietsService } from './diets.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { UpsertDietDto } from './dto/upsert-diet.dto';

@Controller('diets')
@UseGuards(SupabaseAuthGuard)
export class DietsController {
    constructor(private readonly dietsService: DietsService) { }

    @Get('my-diet')
    async getMyDiet(@Request() req: any) {
        return this.dietsService.getDiet(req.user.sub);
    }

    @Get('member/:memberId')
    async getMemberDiet(@Param('memberId') memberId: string) {
        return this.dietsService.getDiet(memberId);
    }

    @Post()
    async upsertDiet(@Request() req: any, @Body() upsertDietDto: UpsertDietDto) {
        const coachId = req.user.sub;
        return this.dietsService.upsertDiet({
            memberId: upsertDietDto.memberId,
            coachId,
            content: upsertDietDto.content,
            name: upsertDietDto.name
        });
    }
}
