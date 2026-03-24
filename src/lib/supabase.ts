import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://avsnsxaesmekypiayoit.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2c25zeGFlc21la3lwaWF5b2l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMzA3NDIsImV4cCI6MjA4OTkwNjc0Mn0.1jXKDV0mSa1o3oOqs6zMxxIj85DAri-3heUvFjfzp7A'
);
