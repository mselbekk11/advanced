import { createClient } from '@supabase/supabase-js';

const supabaseURL = 'https://hoaftyztevnbifmywkzw.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhvYWZ0eXp0ZXZuYmlmbXl3a3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk2MTE2NTYsImV4cCI6MjAyNTE4NzY1Nn0.0WRRmIRSLXO46ygBQ2YX_04EgIjxmas6cV_EV-cWB7A';

export const supabase = createClient(supabaseURL, supabaseAnonKey);
