import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BodyWithUser } from 'src/types/body';
import { CreateJobPostDTO } from './dto/create.dto';
import { JobPostService } from './job-post.service';

@Controller('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Post()
  async createJobPost(@Body() body: BodyWithUser<CreateJobPostDTO>) {
    const { user, ...data } = body;
    return await this.jobPostService.createJobPost(data, user.id);
  }

  @Get(':slug')
  async getJobPost(@Param('slug') slug: string) {
    return await this.jobPostService.getJobPost(slug);
  }
  @Get('user/:username')
  async getJobPostsByUsername(
    @Param('username') username: string,
    @Query('take') take?: string,
  ) {
    return await this.jobPostService.getJobPostsByUsername(username, take);
  }

  @Get()
  async getAllJobPosts(@Query('take') take?: string) {
    return await this.jobPostService.getAllJobPosts(take);
  }
}
