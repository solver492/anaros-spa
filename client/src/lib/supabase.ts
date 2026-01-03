import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bkyhsfgkvprmtnsaattn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJreWhzZmdrdnBybXRuc2FhdHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNzU0MTEsImV4cCI6MjA4Mjg1MTQxMX0.86prBjO5Suk6mMZ7l2XZjjIKnIuivV5NIFeK4ATcOs8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
