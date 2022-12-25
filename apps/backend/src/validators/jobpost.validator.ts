import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateJobSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .min(20)
    .max(1000),
  description: z
    .string({
      required_error: 'Description is required',
      invalid_type_error: 'Description must be a string',
    })
    .min(100),
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .optional(),
  tags: z.array(z.string()).optional(),
  category: z.string({
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  images: z.array(z.string()).optional(),
  deadline: z
    .string({
      invalid_type_error: 'Deadline must be a string',
    })
    .optional(),
});

export class CreateJobDto extends createZodDto(CreateJobSchema) {}
