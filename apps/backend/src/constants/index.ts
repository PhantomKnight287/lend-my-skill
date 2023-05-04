/* eslint-disable @typescript-eslint/no-namespace */
import { z } from 'zod';
import 'dotenv/config';

const EnvSchema = z.object({
  PORT: z.string({}).default('5000'),
  DATABASE_URL: z.string({
    required_error: 'DATABASE_URL must be added to .env file',
  }),
});

export const Env = EnvSchema.safeParse(process.env);
if (Env.success === false) {
  throw new Error(Env.error.errors[0].message);
}

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof EnvSchema> {}
  }
}
