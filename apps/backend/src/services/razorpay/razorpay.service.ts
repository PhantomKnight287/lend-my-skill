import { Injectable } from '@nestjs/common';
import Razorpay from 'razorpay';
import { RAZORPAY_KEY, RAZORPAY_SECRET } from 'src/constants';
@Injectable()
export class RazorpayService extends Razorpay {
  constructor() {
    super({
      key_id: RAZORPAY_KEY,
      key_secret: RAZORPAY_SECRET,
    });
  }
}
