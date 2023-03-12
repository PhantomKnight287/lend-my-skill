import { Controller, Get } from '@nestjs/common';
import { StaticService } from './static.service';

@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('profiles')
  async getProfiles() {
    return await this.staticService.getStaticProfiles();
  }
  @Get('services')
  async getServices() {
    return await this.staticService.getStaticServices();
  }
}
