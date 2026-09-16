const pending = new Map<string, Promise<number | null>>();

// Coalesce React remounts while a request is pending. The marker is written only
// after a confirmed increment; blocked browser storage must not break the article.
export function recordBlogView(slug: string): Promise<number | null> {
  const existing = pending.get(slug);
  if (existing) return existing;
  const task = (async () => {
    const key = `blog-viewed:v2:${slug}`;
    let counted = false;
    try {
      counted = sessionStorage.getItem(key) === "1";
    } catch {
      /* Storage may be blocked. */
    }
    try {
      const response = await fetch(`/api/blog-view?slug=${encodeURIComponent(slug)}`, {
        method: counted ? "GET" : "POST",
        cache: "no-store",
      });
      if (!response.ok) return null;
      const { count } = await response.json();
      if (!Number.isSafeInteger(count) || count < 0) return null;
      if (!counted) {
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          /* Keep displaying the saved count. */
        }
      }
      return count as number;
    } catch {
      return null;
    }
  })().finally(() => pending.delete(slug));
  pending.set(slug, task);
  return task;
}
