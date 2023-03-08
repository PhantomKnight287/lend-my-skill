import { Controller, Get } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Token } from 'decorator/token/token.decorator';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Token({ serialize: true }) { id }) {
    return await this.profileService.findUser(id);
  }
}
