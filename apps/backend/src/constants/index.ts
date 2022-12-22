import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 5000;
export const SIGN_SECRET = process.env.JWT_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_TOKEN;

if (!SIGN_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}

if (!REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET must be defined');
}
