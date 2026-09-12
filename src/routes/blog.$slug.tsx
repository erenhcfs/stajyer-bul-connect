import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, ArrowLeft, Loader2 } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogDetailPage,
});

interface BlogPostDetail {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

function BlogDetailPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPostDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPostDetail() {
      try {
        const { data, error } = await supabase
          .from("blogs")
          .select("id, title, content, image_url, created_at")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        console.error("Yazı yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPostDetail();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-x py-20 text-center">
        <h1 className="text-2xl font-bold">Yazı bulunamadı</h1>
        <p className="mt-2 text-muted-foreground">Aradığınız blog yazısı silinmiş veya taşınmış olabilir.</p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> Bloga Dön
        </Link>
      </div>
    );
  }

  return (
    <article className="container-x py-12 max-w-3xl">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="size-4" /> Tüm Yazılara Dön
      </Link>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <Calendar className="size-4" />
        <span>{new Date(post.created_at).toLocaleDateString("tr-TR")}</span>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
        {post.title}
      </h1>

      {post.image_url && (
        <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-md">
          <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
        </div>
        
      )}

      <div 
        className="mt-10 prose prose-lg dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}