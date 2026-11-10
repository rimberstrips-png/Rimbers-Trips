import { createClient } from "@supabase/supabase-js";

const env = import.meta.env as Record<string, string | undefined>;
const supabaseUrl = env["VITE_SUPABASE_URL"];
const supabaseAnonKey = env["VITE_SUPABASE_ANON_KEY"];

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Fall back to harmless placeholder values when unconfigured so the client can
// always be constructed (Supabase throws synchronously on empty strings, which
// would otherwise crash SSR for every route that imports this module). Actual
// requests will fail with a normal network/auth error, surfaced via isSupabaseConfigured
// or the calling query's error state instead of an unrecoverable render crash.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
);
