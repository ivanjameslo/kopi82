// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase URL or anonymous key.");
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gdxxyfiodvmrnonepzls.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkeHh5ZmlvZHZtcm5vbmVwemxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1NDY5MDgsImV4cCI6MjA0NDEyMjkwOH0.j1BlQ5GZKulVpkJzddv18l9qDDLLzA6yfeBzCgq1TdI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anonymous key.");
}