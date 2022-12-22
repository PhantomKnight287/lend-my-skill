import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const RegisterSchema = z
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
      .min(8),
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
      .min(8),
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
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

export class RegisterDto extends createZodDto(RegisterSchema) {}
