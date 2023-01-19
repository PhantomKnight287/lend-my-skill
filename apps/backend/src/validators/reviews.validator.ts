import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateReviewValidator = z.object({
  rating: z
    .number({
      description: 'Rating of the review',
      required_error: 'Rating is required',
      invalid_type_error: 'Rating must be a number',
    })
    .min(1)
    .max(5),
  content: z
    .string({
      description: 'Content of the review',
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string',
    }),
  freelancerUsername: z.string({
    description: 'Username of the freelancer',
    required_error: 'Freelancer username is required',
    invalid_type_error: 'Freelancer username must be a string',
  }),
});

export class CreateReviewDto extends createZodDto(CreateReviewValidator) {}