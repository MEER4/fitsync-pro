import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DietTemplatesService {
    constructor(private prisma: PrismaService) { }

    async findAll(coachId: string) {
        return this.prisma.diet_templates.findMany({
            where: { coach_id: coachId },
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(id: string, coachId: string) {
        return this.prisma.diet_templates.findFirst({
            where: { id, coach_id: coachId },
        });
    }

    async create(data: { coachId: string; name: string; description?: string; content: any }) {
        return this.prisma.diet_templates.create({
            data: {
                coach_id: data.coachId,
                name: data.name,
                description: data.description,
                content: data.content,
            },
        });
    }

    async update(id: string, coachId: string, data: { name?: string; description?: string; content?: any }) {
        return this.prisma.diet_templates.update({
            where: { id },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.content && { content: data.content }),
            },
        });
    }

    async remove(id: string, coachId: string) {
        // Check if it belongs to coach
        const template = await this.findOne(id, coachId);
        if (!template) {
            throw new Error('Template not found or unauthorized');
        }

        return this.prisma.diet_templates.delete({
            where: { id },
        });
    }
}

