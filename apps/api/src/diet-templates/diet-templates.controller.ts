import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { DietTemplatesService } from './diet-templates.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { CreateDietTemplateDto } from './dto/create-diet-template.dto';
import { UpdateDietTemplateDto } from './dto/update-diet-template.dto';

@Controller('diet-templates')
@UseGuards(SupabaseAuthGuard)
export class DietTemplatesController {
    constructor(private readonly dietTemplatesService: DietTemplatesService) { }

    @Get()
    findAll(@Req() req) {
        return this.dietTemplatesService.findAll(req.user.sub);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req) {
        const template = await this.dietTemplatesService.findOne(id, req.user.sub);
        if (!template) throw new NotFoundException('Template not found');
        return template;
    }

    @Post()
    create(@Body() createDietTemplateDto: CreateDietTemplateDto, @Req() req) {
        return this.dietTemplatesService.create({
            coachId: req.user.sub,
            name: createDietTemplateDto.name,
            description: createDietTemplateDto.description,
            content: createDietTemplateDto.content,
        });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateDietTemplateDto: UpdateDietTemplateDto, @Req() req) {
        const existing = await this.dietTemplatesService.findOne(id, req.user.sub);
        if (!existing) throw new NotFoundException('Template not found');

        return this.dietTemplatesService.update(id, req.user.sub, updateDietTemplateDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req) {
        try {
            await this.dietTemplatesService.remove(id, req.user.sub);
            return { success: true };
        } catch (e) {
            throw new NotFoundException((e as Error).message);
        }
    }
}
