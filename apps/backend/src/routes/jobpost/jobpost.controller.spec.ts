import { Test, TestingModule } from '@nestjs/testing';
import { JobpostController } from './jobpost.controller';

describe('JobpostController', () => {
  let controller: JobpostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobpostController],
    }).compile();

    controller = module.get<JobpostController>(JobpostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
