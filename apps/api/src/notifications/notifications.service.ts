import { Injectable, Logger } from '@nestjs/common';
import * as webpush from 'web-push';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(private prisma: PrismaService) {
        const publicKey = process.env.VAPID_PUBLIC_KEY || '';
        const privateKey = process.env.VAPID_PRIVATE_KEY || '';

        if (publicKey && privateKey) {
            webpush.setVapidDetails(
                'mailto:support@fitsyncpro.com',
                publicKey,
                privateKey
            );
        } else {
            this.logger.warn('VAPID keys not configured for web-push.');
        }
    }

    async saveSubscription(userId: string, subscription: any) {
        return this.prisma.profiles.update({
            where: { id: userId },
            data: { push_subscription: subscription as any },
        });
    }

    async sendNotification(userId: string, payload: { title: string; body: string; url?: string }) {
        try {
            const user = await this.prisma.profiles.findUnique({
                where: { id: userId },
                select: { push_subscription: true },
            });

            if (!user || !user.push_subscription) {
                return false;
            }

            const subscription = user.push_subscription as any;

            await webpush.sendNotification(
                subscription,
                JSON.stringify(payload)
            );

            this.logger.log(`Push notification sent to user ${userId}`);
            return true;
        } catch (error) {
            this.logger.error(`Error sending push notification to user ${userId}: ${error.message}`);

            // If subscription is invalid/expired (410 Gone), we could remove it here
            if (error.statusCode === 410) {
                await this.prisma.profiles.update({
                    where: { id: userId },
                    data: { push_subscription: null },
                });
            }
            return false;
        }
    }
}
