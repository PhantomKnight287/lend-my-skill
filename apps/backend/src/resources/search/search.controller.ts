import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('type') sType: 'Job' | 'Service',
    @Query('take') take?: string,
  ) {
    if (!query)
      throw new HttpException(
        `Search parameter is required`,
        HttpStatus.BAD_REQUEST,
      );
    if (sType !== 'Service' && sType !== 'Job') {
      throw new HttpException(
        'Please Specify type of response required. Possible values are "Job" and "Service"',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.searchService.search(query, sType, take);
  }

  @Get('category/:category')
  async searchByCategory(
    @Query('q') query: string,
    @Param('category') category: string,
    @Query('type') sType: 'Job' | 'Service',
    @Query('take') take?: string,
  ) {
    if (!query)
      throw new HttpException(
        `Search parameter is required`,
        HttpStatus.BAD_REQUEST,
      );
    if (sType !== 'Service' && sType !== 'Job') {
      throw new HttpException(
        `Please Specify type of response required. Possible values are "Job" and "Service"`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.searchService.searchByCategory(
      category,
      query,
      sType,
      take,
    );
  }
  @Get('tag/:tag')
  async searchByTag(
    @Query('q') query: string,
    @Param('tag') tag: string,
    @Query('type') sType: 'Job' | 'Service',
    @Query('take') take?: string,
  ) {
    if (!query)
      throw new HttpException(
        `Search parameter is required`,
        HttpStatus.BAD_REQUEST,
      );
    if (sType !== 'Service' && sType !== 'Job') {
      throw new HttpException(
        `Please Specify type of response required. Possible values are "Job" and "Service"`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.searchService.searchByTag(tag, query, sType, take);
  }
}
