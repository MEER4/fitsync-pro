import { Test, TestingModule } from '@nestjs/testing';
import { DietTemplatesController } from './diet-templates.controller';

describe('DietTemplatesController', () => {
  let controller: DietTemplatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DietTemplatesController],
    }).compile();

    controller = module.get<DietTemplatesController>(DietTemplatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
