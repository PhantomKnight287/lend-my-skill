import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async fetchAll() {
    return await this.categoriesService.fetchAll();
  }

  @Post('create')
  async create(@Body('name') name: string) {
    if (!name) throw new HttpException('Name of category is required.', 400);
    return await this.categoriesService.create(name);
  }
}
