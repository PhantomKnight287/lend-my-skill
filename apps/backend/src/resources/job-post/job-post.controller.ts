import { Body, Controller, Post } from '@nestjs/common';
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
}
