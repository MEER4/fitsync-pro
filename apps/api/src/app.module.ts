import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExercisesModule } from './exercises/exercises.module';
import { RoutinesModule } from './routines/routines.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AuthModule,
        PrismaModule,
        ExercisesModule,
        RoutinesModule,
        AssignmentsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
