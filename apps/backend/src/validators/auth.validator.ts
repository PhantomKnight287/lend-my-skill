import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const SellerRegisterSchema = z
  .object({
    email: z
      .string({
        required_error: 'Email is required',
        invalid_type_error: 'Email must be a string',
      })
      .email(),
    password: z
      .password({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .atLeastOne('digit')
      .atLeastOne('lowercase')
      .atLeastOne('special')
      .atLeastOne('uppercase')
      .min(8, { message: 'Password must be at least 8 characters long' }),
    username: z
      .string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
      })
      .min(3),
    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
        invalid_type_error: 'Confirm Password must be a string',
      })
      .min(8, { message: 'Password must be at least 8 characters long' }),
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    country: z
      .string({
        invalid_type_error: 'Country must be a string',
      })
      .optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password and Confirm Password must be same',
        path: ['confirmPassword'],
      });
    }
  });

export class SellerRegisterDto extends createZodDto(SellerRegisterSchema) {}
export class BuyerRegisterDto extends createZodDto(SellerRegisterSchema) {}

const SellerLoginSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z

    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export class SellerLoginDto extends createZodDto(SellerLoginSchema) {}
export class BuyerLoginDto extends createZodDto(SellerLoginSchema) {}
