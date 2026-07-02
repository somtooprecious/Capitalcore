import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwnerApi } from "@/lib/require-owner-api";

export async function GET() {
  const owner = await requireOwnerApi();
  if ("error" in owner) return owner.error;

  const posts = await prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    posts: posts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      published: p.published,
      publishedAt: p.publishedAt?.toISOString() ?? null,
      updatedAt: p.updatedAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const owner = await requireOwnerApi();
  if ("error" in owner) return owner.error;

  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    published?: boolean;
  };

  if (!body.slug || !body.title || !body.content) {
    return NextResponse.json({ error: "Slug, title, and content are required." }, { status: 400 });
  }

  const post = await prisma.blogPost.create({
    data: {
      slug: body.slug.toLowerCase().replace(/\s+/g, "-"),
      title: body.title,
      excerpt: body.excerpt ?? "",
      content: body.content,
      published: Boolean(body.published),
      publishedAt: body.published ? new Date() : null,
    },
  });

  return NextResponse.json({ post: { id: post.id, slug: post.slug } });
}
