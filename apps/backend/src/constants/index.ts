import { config } from 'dotenv';

config();

export const PORT = process.env.PORT || 5000;
export const SIGN_SECRET = process.env.JWT_SECRET;
export const REFRESH_SECRET = process.env.REFRESH_TOKEN;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY;
export const RAZORPAY_KEY = process.env.RAZORPAY_KEY;
export const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

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

if (!RAZORPAY_KEY) {
  throw new Error('RAZORPAY_KEY must be defined');
}
if (!RAZORPAY_SECRET) {
  throw new Error('RAZORPAY_SECRET must be defined');
}

if (!RAZORPAY_WEBHOOK_SECRET) {
  throw new Error('RAZORPAY_WEBHOOK_SECRET must be defined');
}
