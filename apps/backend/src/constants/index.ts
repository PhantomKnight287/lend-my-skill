import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 5000;
export const SIGN_SECRET = process.env.JWT_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_TOKEN;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SIGN_SECRET) {
  throw new Error('JWT_SECRET must be defined');
}

if (!REFRESH_SECRET) {
  throw new Error('JWT_REFRESH_SECRET must be defined');
}

if (!SUPABASE_URL) {
  throw new Error('SUPABASE_URL must be defined');
}
if (!SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY must be defined');
}
