import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateGigSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .max(50),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }),
  category: z.string({
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  tags: z.array(z.string()).optional(),
  bannerImage: z.string({
    required_error: 'Banner Image is required',
    invalid_type_error: 'Banner Image must be a string',
  }),
  price: z.number({
    required_error: 'Price is required',
    invalid_type_error: 'Price must be a number',
  }),
  images: z.array(z.string()).optional(),
});

export class CreateGigDto extends createZodDto(CreateGigSchema) {}
