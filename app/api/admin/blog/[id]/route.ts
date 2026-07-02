import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireOwnerApi } from "@/lib/require-owner-api";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const owner = await requireOwnerApi();
  if ("error" in owner) return owner.error;

  const { id } = await params;
  const body = (await request.json()) as {
    slug?: string;
    title?: string;
    excerpt?: string;
    content?: string;
    published?: boolean;
  };

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const post = await prisma.blogPost.update({
    where: { id },
    data: {
      slug: body.slug ? body.slug.toLowerCase().replace(/\s+/g, "-") : undefined,
      title: body.title,
      excerpt: body.excerpt,
      content: body.content,
      published: body.published,
      publishedAt:
        body.published === true && !existing.publishedAt
          ? new Date()
          : body.published === false
            ? null
            : undefined,
    },
  });

  return NextResponse.json({ post: { id: post.id, slug: post.slug } });
}

export async function DELETE(_request: Request, { params }: Params) {
  const owner = await requireOwnerApi();
  if ("error" in owner) return owner.error;

  const { id } = await params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
