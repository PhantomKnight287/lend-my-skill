import { Test, TestingModule } from '@nestjs/testing';
import { UpiController } from './upi.controller';
import { UpiService } from './upi.service';

describe('UpiController', () => {
  let controller: UpiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpiController],
      providers: [UpiService],
    }).compile();

    controller = module.get<UpiController>(UpiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
