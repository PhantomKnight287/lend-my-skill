import { Test, TestingModule } from '@nestjs/testing';
import { GigsService } from './gigs.service';

describe('GigsService', () => {
  let service: GigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GigsService],
    }).compile();

    service = module.get<GigsService>(GigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
