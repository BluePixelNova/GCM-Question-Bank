
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// Accessing environment variables via process.env as required by the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase credentials missing. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set in the environment.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
