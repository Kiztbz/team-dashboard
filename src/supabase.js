import { createClient } from '@supabase/supabase-js';

// Both dev (Vite proxy) and prod (Vercel rewrite) route through /supabase
// This avoids CORS and SSL issues by proxying through the same origin
const supabaseUrl = import.meta.env.DEV
  ? 'http://localhost:5173/supabase'
  : `${window.location.origin}/supabase`;

const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cmxnaXFmbml4b2R4d3JudG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NzE3MjQsImV4cCI6MjA4NzQ0NzcyNH0.Sk9feheayWafxVg1kqpHX41q1aIdE3sGQ0uYjqPJUwA';

export const supabase = createClient(supabaseUrl, supabaseKey);
