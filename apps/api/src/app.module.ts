import { Module } from '@nestjs/common';
import { NotificationsModule } from './notifications/notifications.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExercisesModule } from './exercises/exercises.module';
import { RoutinesModule } from './routines/routines.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DietsModule } from './diets/diets.module';
import { LeadsModule } from './leads/leads.module';
import { MailModule } from './mail/mail.module';
import { DietTemplatesModule } from './diet-templates/diet-templates.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        ThrottlerModule.forRoot([
            {
                name: 'short',
                ttl: 1000, // 1 second
                limit: 3, // 3 requests per second
            },
            {
                name: 'medium',
                ttl: 10000, // 10 seconds
                limit: 20, // 20 requests per 10 seconds
            },
            {
                name: 'long',
                ttl: 60000, // 60 seconds
                limit: 100, // 100 requests per minute
            },
        ]),
        AuthModule,
        PrismaModule,
        ExercisesModule,
        RoutinesModule,
        AssignmentsModule,
        UsersModule,
        DashboardModule,
        DietsModule,
        NotificationsModule,
        LeadsModule,
        MailModule,
        DietTemplatesModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
