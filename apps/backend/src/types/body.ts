import { User } from '@prisma/client';

export type BodyWithUser<T> = T & { user: User };
