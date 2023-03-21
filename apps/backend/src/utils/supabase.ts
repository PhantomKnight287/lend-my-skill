import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from 'src/constants';

export const client = createClient(SUPABASE_URL, SUPABASE_KEY);
