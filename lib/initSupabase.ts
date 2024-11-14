import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or anonymous key.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Service role key for server-side only

// if (!supabaseUrl || !supabaseServiceKey) {
//   throw new Error("Missing Supabase URL or service role key.");
// }

// // This client should only be used in a server environment (e.g., API routes or backend functions)
// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
