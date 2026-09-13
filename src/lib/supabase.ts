import { createClient } from "@supabase/supabase-js";

// NOT: Projende zaten bir "src/lib/supabase.ts" (veya benzeri) dosyan
// varsa onu kullan, bu dosyayı eklemene gerek yok — sadece "blog_posts"
// tablosuna erişim için aynı client'ı kullanman yeterli.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY ortam değişkenleri tanımlı değil.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
