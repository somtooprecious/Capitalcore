"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  published: boolean;
};

const emptyForm = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  published: false,
};

export function AdminBlogPanel() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/blog");
    const data = (await res.json()) as { posts: BlogPost[] };
    setPosts(data.posts ?? []);
  };

  useEffect(() => {
    void load();
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch(editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        toast.error("Could not save blog post.");
        return;
      }
      toast.success(editingId ? "Post updated." : "Post created.");
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete post.");
      return;
    }
    toast.success("Post deleted.");
    await load();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{editingId ? "Edit post" : "New blog post"}</h2>
          {editingId ? (
            <Button variant="outline" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Cancel
            </Button>
          ) : (
            <Plus className="h-4 w-4 text-muted" />
          )}
        </div>
        <Input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
        <textarea
          className="min-h-40 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm"
          placeholder="Content (markdown supported)"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          Published
        </label>
        <Button onClick={save} disabled={loading}>
          {loading ? "Saving…" : editingId ? "Update post" : "Create post"}
        </Button>
      </Card>

      <Card className="space-y-3 p-6">
        <h2 className="font-semibold">Published & draft posts</h2>
        {posts.length === 0 ? (
          <p className="text-sm text-muted">No blog posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="flex items-start justify-between gap-3 rounded-xl border border-border p-3">
              <div>
                <p className="font-medium">{post.title}</p>
                <p className="text-xs text-muted">/{post.slug} · {post.published ? "Published" : "Draft"}</p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className="rounded-lg p-2 hover:bg-white/5"
                  onClick={() => {
                    setEditingId(post.id);
                    setForm({
                      slug: post.slug,
                      title: post.title,
                      excerpt: post.excerpt ?? "",
                      content: post.content,
                      published: post.published,
                    });
                  }}
                  aria-label="Edit post"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                  onClick={() => remove(post.id)}
                  aria-label="Delete post"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
