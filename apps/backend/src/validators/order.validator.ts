import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateOrder = z.object({
  sellerUsername: z.string({
    required_error: 'Seller username is required',
    invalid_type_error: 'Seller username must be a string',
  }),
  packageId: z.string({
    required_error: 'Package id is required',
    invalid_type_error: 'Package id must be a string',
  }),
  discountCode: z
    .string({
      invalid_type_error: 'Discount code must be a string',
    })
    .optional(),
});

export class CreateOrderDto extends createZodDto(CreateOrder) {}
