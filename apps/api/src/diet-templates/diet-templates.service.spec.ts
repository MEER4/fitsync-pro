import { Test, TestingModule } from '@nestjs/testing';
import { DietTemplatesService } from './diet-templates.service';

describe('DietTemplatesService', () => {
  let service: DietTemplatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DietTemplatesService],
    }).compile();

    service = module.get<DietTemplatesService>(DietTemplatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
