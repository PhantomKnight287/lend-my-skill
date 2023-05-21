import { Test, TestingModule } from '@nestjs/testing';
import { RazorpayService } from './razorpay.service';

describe('RazorpayService', () => {
  let service: RazorpayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RazorpayService],
    }).compile();

    service = module.get<RazorpayService>(RazorpayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
