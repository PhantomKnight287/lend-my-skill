import { Test, TestingModule } from '@nestjs/testing';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';

describe('StaticController', () => {
  let controller: StaticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticController],
      providers: [StaticService],
    }).compile();

    controller = module.get<StaticController>(StaticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
