import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WEBHOOK_URL } from 'src/constants';
@Injectable()
export class WebhookService {
  async sendWebhook(body: Record<any, any>) {
    await axios.post(WEBHOOK_URL, body).catch((err) => {
      console.log(err?.response?.data);
    });
  }
}
