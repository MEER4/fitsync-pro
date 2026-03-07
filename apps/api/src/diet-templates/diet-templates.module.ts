import { Module } from '@nestjs/common';
import { DietTemplatesController } from './diet-templates.controller';
import { DietTemplatesService } from './diet-templates.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DietTemplatesController],
  providers: [DietTemplatesService]
})
export class DietTemplatesModule {}
