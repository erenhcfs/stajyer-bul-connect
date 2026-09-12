import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPostDetail,
});

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  created_at: string;
}

function BlogPostDetail() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Blog yazısı yüklenirken hata oluştu:", error);
      } else {
        setPost(data);
      }
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-white">Yükleniyor...</div>;
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Yazı Bulunamadı</h1>
        <p className="text-slate-400 mb-6">Aradığınız blog yazısı silinmiş veya mevcut değil.</p>
        <Link to="/blog" className="text-indigo-400 hover:underline">
          &larr; Blog listesine geri dön
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Bloga Dön</span>
      </Link>

      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
        {post.title}
      </h1>

      <p className="text-sm text-slate-400 mb-8">
        {new Date(post.created_at).toLocaleDateString("tr-TR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-xl mb-8 border border-slate-700 shadow-xl"
        />
      )}

      {/* Blog İçeriği */}
      <div 
        className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}