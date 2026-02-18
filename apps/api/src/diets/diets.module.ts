import { Module } from '@nestjs/common';
import { DietsController } from './diets.controller';
import { DietsService } from './diets.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [DietsController],
    providers: [DietsService],
    exports: [DietsService],
})
export class DietsModule { }
