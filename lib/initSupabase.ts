// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase URL or anonymous key.");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bcylygdznxhuuftemumn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeWx5Z2R6bnhodXVmdGVtdW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNzE5NDMsImV4cCI6MjA0MDg0Nzk0M30.4zxRsv6F6EoZN2n2u6VjDrFVvt2jfcGN9vMEFj2VQSQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anonymous key.");
}