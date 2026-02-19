import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gyxqovdsmbltvfejwqmj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5eHFvdmRzbWJsdHZmZWp3cW1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzQ5MTUsImV4cCI6MjA3MjU1MDkxNX0.svUXcLngUq_wIj0un7_d3epFOvsFi5ODjlYrmh6HLnQ";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase client env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
