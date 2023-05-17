import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';
@Injectable()
export class ConversionService {
  constructor(protected p: PrismaService) {
    this.updateConversionRates();
  }

  async getConversionRate(to: string): Promise<number | null> {
    const rate = await this.p.conversionRate.findUnique({
      where: {
        to,
      },
    });
    if (!rate) return null;
    return rate.rate;
  }
  async updateConversionRates() {
    const lastRecord = await this.p.conversionRate.findFirst({});
    const lastRecordDate = new Date(lastRecord.createdAt);
    const now = new Date();
    if (now.getTime() - lastRecordDate.getTime() > 43200000) {
      axios
        .get('https://api.exchangerate.host/latest?base=USD')
        .then(({ data }) => {
          Object.keys(data.rates).forEach(async (key) => {
            await this.p.conversionRate.upsert({
              where: {
                to: key,
              },
              update: {
                rate: data.rates[key],
                createdAt: new Date(),
              },
              create: {
                rate: data.rates[key],
                to: key,
              },
            });
          });
        })
        .catch(console.log);
    }
  }
}
