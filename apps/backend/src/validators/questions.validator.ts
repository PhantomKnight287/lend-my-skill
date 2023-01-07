import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const AnswersValidator = z.object({
  answers: z.array(
    z.object({
      id: z.string(),
      answer: z.string(),
      isAttachment: z.boolean(),
      question: z.string(),
    }),
  ),
});

export class AnswersDto extends createZodDto(AnswersValidator) {}
