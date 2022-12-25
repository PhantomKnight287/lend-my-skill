import { Test, TestingModule } from '@nestjs/testing';
import { HydrateController } from './hydrate.controller';

describe('HydrateController', () => {
  let controller: HydrateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HydrateController],
    }).compile();

    controller = module.get<HydrateController>(HydrateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
