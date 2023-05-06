import { Test, TestingModule } from '@nestjs/testing';
import { UpiService } from './upi.service';

describe('UpiService', () => {
  let service: UpiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpiService],
    }).compile();

    service = module.get<UpiService>(UpiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
