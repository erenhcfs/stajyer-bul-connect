import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
});

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
}

function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Blog yazıları çekilirken hata oluştu:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-white">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Blog ve Staj Rehberi</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 flex flex-col">
            {post.image_url && (
              <img src={post.image_url} alt={post.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-white mb-2">{post.title}</h2>
              <p className="text-slate-400 text-sm mb-4 flex-grow">{post.excerpt}</p>
              <Link
                to={`/blog/$slug`}
                params={{ slug: post.slug }}
                className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center"
              >
                Devamını Oku &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}