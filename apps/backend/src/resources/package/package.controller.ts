import { Controller, Get, Param } from '@nestjs/common';
import { PackageService } from './package.service';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get(':id')
  async getPackageInfo(@Param('id') id: string) {
    return await this.packageService.getPackageInfo(id);
  }
}
