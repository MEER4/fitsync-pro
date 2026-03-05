import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class LeadsService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService
    ) { }

    async create(data: {
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
        coach_id?: string;
    }) {
        // If coach_id is not provided, assign to the first coach found in the system
        if (!data.coach_id) {
            const firstCoach = await this.prisma.profiles.findFirst({
                where: { role: 'coach' }
            });
            if (firstCoach) {
                data.coach_id = firstCoach.id;
            }
        }

        const newLead = await this.prisma.leads.create({ data });

        // Send email notification if assigned to a coach
        if (newLead.coach_id) {
            const coach = await this.prisma.profiles.findUnique({
                where: { id: newLead.coach_id }
            });
            if (coach && coach.email) {
                this.mailService.sendNewLeadEmail(coach.email, newLead).catch(console.error);
            }
        }

        return newLead;
    }

    async findAllByCoach(coachId: string) {
        return this.prisma.leads.findMany({
            where: { coach_id: coachId },
            orderBy: { created_at: 'desc' },
        });
    }

    async updateStatus(id: string, status: string, coachId: string) {
        return this.prisma.leads.update({
            where: { id },
            data: { status },
        });
    }

    async delete(id: string, coachId: string) {
        return this.prisma.leads.delete({
            where: { id },
        });
    }
}
