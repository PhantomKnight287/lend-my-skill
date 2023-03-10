import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { Token } from 'decorator/token/token.decorator';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async fetchAll() {
    return await this.tagsService.fetchAll();
  }

  @Post('create')
  async create(@Token({ serialize: true }) { id }, @Body('name') name: string) {
    if (!name) throw new HttpException('Name of tag is required.', 400);
    return await this.tagsService.create(name);
  }
}
