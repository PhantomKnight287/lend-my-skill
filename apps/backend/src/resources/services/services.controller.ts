import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BodyWithUser } from 'src/types/body';
import { CreateServiceDTO } from './dto/create-service.dto';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async createService(@Body() body: BodyWithUser<CreateServiceDTO>) {
    return this.servicesService.createService(body, body.user.id);
  }

  @Get(':username/:slug')
  async getService(
    @Param('username') username: string,
    @Param('slug') slug: string,
  ) {
    return this.servicesService.getService(slug, username);
  }

  @Get(':username')
  async getServices(
    @Param('username') username: string,
    @Query('take') take?: string,
  ) {
    return this.servicesService.getServices(username, take);
  }
}
