
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wucwtbxeandlvcfxipkv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Y3d0YnhlYW5kbHZjZnhpcGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExNTU5OTUsImV4cCI6MjA1NjczMTk5NX0.KENTxS8cAC_pootgrIQDXh4kbJIrDX7uY5v-l2i9Voc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
