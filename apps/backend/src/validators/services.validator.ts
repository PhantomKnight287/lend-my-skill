import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateServiceSchema = z.object({
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string',
    })
    .max(100),
  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }).min(100),
  category: z.string({
    required_error: 'Category is required',
    invalid_type_error: 'Category must be a string',
  }),
  tags: z.array(z.string()).optional(),
  bannerImage: z.string({
    required_error: 'Banner Image is required',
    invalid_type_error: 'Banner Image must be a string',
  }),
  images: z.array(z.string()).optional(),
  packages: z
    .array(
      z.object({
        name: z.string({
          required_error: 'Package name is required',
          invalid_type_error: 'Package name must be a string',
        }),
        description: z.string({
          required_error: 'Package description is required',
          invalid_type_error: 'Package description must be a string',
        }),
        price: z.number({
          required_error: 'Package price is required',
          invalid_type_error: 'Package price must be a number',
        }),
        deliveryDays: z
          .number({
            required_error: 'Package delivery days is required',
            invalid_type_error: 'Package delivery days must be a number',
          })
          .min(1)
          .max(90),
      }),
    )
    .max(3),
  features: z.array(
    z.object({
      name: z.string({
        required_error: 'Feature name is required',
        invalid_type_error: 'Feature name must be a string',
      }),
      includedIn: z.array(z.string()),
    }),
  ),
  questions: z.array(
    z.object({
      question: z.string({
        required_error: 'Question is required',
        invalid_type_error: 'Question must be a string',
      }),
      type: z.enum(['TEXT', 'ATTACHMENT']),
      required: z.boolean({
        required_error: 'Required is required',
        invalid_type_error: 'Required must be a boolean',
      }),
    }),
  ),
});

export class CreateServiceDto extends createZodDto(CreateServiceSchema) {}
