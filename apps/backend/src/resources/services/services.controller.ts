import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Token } from 'decorator/token/token.decorator';
import { CreateServiceDTO } from './dto/create-service.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async createService(
    @Token({ serialize: true }) { id },
    @Body() body: CreateServiceDTO,
  ) {
    return this.servicesService.createService(body, id);
  }

  @Get(':username/:slug')
  async getService(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    return this.servicesService.getService(slug, username);
  }
}
