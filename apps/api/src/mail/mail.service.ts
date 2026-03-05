import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor() {
        // Attempt to initialize transporter with environment variables
        // If not provided, it will log a warning and skip sending
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587', 10),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    async sendNewLeadEmail(coachEmail: string, lead: any) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            this.logger.warn('SMTP credentials not configured. Skipping email notification. Please configure SMTP_USER and SMTP_PASS in .env');
            return;
        }

        try {
            await this.transporter.sendMail({
                from: `"FitSync Pro" <${process.env.SMTP_USER}>`,
                to: coachEmail,
                subject: '🔥 ¡Nuevo Prospecto Recibido!',
                html: `
                    <h2>¡Tienes un nuevo prospecto interesado en tus servicios!</h2>
                    <p>Estos son los detalles que proporcionó:</p>
                    <ul>
                        <li><strong>Nombre:</strong> ${lead.full_name}</li>
                        <li><strong>Email:</strong> ${lead.email}</li>
                        <li><strong>Teléfono:</strong> ${lead.phone || 'No proporcionado'}</li>
                        <li><strong>Objetivo:</strong> ${lead.goal || 'No especificado'}</li>
                        <li><strong>Plan Interesado:</strong> ${lead.plan || 'No especificado'}</li>
                        <li><strong>Nivel:</strong> ${lead.experience_level || 'No especificado'}</li>
                    </ul>
                    <p>Entra a tu panel de FitSync para contactarlo y empezar a trabajar.</p>
                `,
            });
            this.logger.log(`New lead email sent to ${coachEmail}`);
        } catch (error) {
            this.logger.error('Failed to send lead email', error);
        }
    }
}
