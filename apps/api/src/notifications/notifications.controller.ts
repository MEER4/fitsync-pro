import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('notifications')
@UseGuards(SupabaseAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post('subscribe')
    async subscribe(
        @Req() req: any,
        @Body() subscription: any,
    ) {
        const userId = req.user.id;
        return this.notificationsService.saveSubscription(userId, subscription);
    }
}
