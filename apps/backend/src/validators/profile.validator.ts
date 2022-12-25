import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const UpdateProfileSchema = z.object({
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
  country: z.string(),
  aboutMe: z.string().optional(),
});

export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) {}
