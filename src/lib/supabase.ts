import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL?.trim();

const key = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
)?.trim();

export const supabaseConfigured = Boolean(
  url &&
  /^https?:\/\//.test(url) &&
  key
);

let client: SupabaseClient | undefined;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    if (!supabaseConfigured) {
      throw new Error(
        "Supabase bağlantısı yapılandırılmamış. Lütfen site yöneticisine bildirin."
      );
    }

    client ??= createClient(url!, key!, {
      auth: {
        persistSession: typeof window !== "undefined",
        autoRefreshToken: typeof window !== "undefined",
        detectSessionInUrl: typeof window !== "undefined",
      },
    });

    const value = Reflect.get(client, property);

    return typeof value === "function"
      ? value.bind(client)
      : value;
  },
});
