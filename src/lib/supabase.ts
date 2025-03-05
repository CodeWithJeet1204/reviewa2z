
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wucwtbxeandlvcfxipkv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1Y3d0YnhlYW5kbHZjZnhpcGt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTY2MzAsImV4cCI6MjA1Njg2Njg3MH0.oJrObQwKH3KrK1cxl0ZdQ8YLtgJwApmRVbkPmGRwFXg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
