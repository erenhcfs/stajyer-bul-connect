export type BlogPost = {
  image_url?: string | null;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author_name: string;
  author_initials: string;
  published: boolean;
  view_count: number;
  seo_title?: string | null;
  seo_description?: string | null;
  keywords?: string[] | null;
  created_at: string;
  updated_at?: string | null;
};

export const BLOG_CATEGORIES = [
  "Staj Süreçleri",
  "Mülakat İpuçları",
  "CV Hazırlama",
  "Kariyer Planlama",
  "Sektör Haberleri",
];

const CATEGORY_GRADIENTS: Record<string, string> = {
  "Staj Süreçleri": "from-primary/25 via-primary/10 to-transparent",
  "Mülakat İpuçları": "from-amber-500/25 via-amber-500/10 to-transparent",
  "CV Hazırlama": "from-sky-500/25 via-sky-500/10 to-transparent",
  "Kariyer Planlama": "from-violet-500/25 via-violet-500/10 to-transparent",
  "Sektör Haberleri": "from-emerald-500/25 via-emerald-500/10 to-transparent",
};

export function categoryGradient(category: string): string {
  return (
    CATEGORY_GRADIENTS[category] ??
    "from-muted-foreground/20 via-muted-foreground/10 to-transparent"
  );
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} dk`;
}

// Türkçe karakterleri de düzgün çeviren basit slugify.
export function slugify(input: string): string {
  const map: Record<string, string> = {
    ç: "c",
    Ç: "c",
    ğ: "g",
    Ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    Ö: "o",
    ş: "s",
    Ş: "s",
    ü: "u",
    Ü: "u",
  };
  return input
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
