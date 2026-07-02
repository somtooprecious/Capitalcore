"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { FaqAccordion } from "@/components/landing/faq-accordion";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

export function HowItWorksContent() {
  const { page } = useTranslations();
  const p = page("how-it-works");
  if (!p) return null;

  return (
    <article className="space-y-10">
      <p className="max-w-3xl text-lg leading-relaxed text-muted">{p.intro}</p>
      {p.introSecondary ? <p className="max-w-3xl text-muted">{p.introSecondary}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        {p.steps?.map((s) => (
          <Card key={s.step} className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400">{s.step}</p>
            <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </Card>
        ))}
      </div>
      {p.sections?.map((section) => (
        <Card key={section.title} className="p-6">
          <h3 className="text-lg font-semibold">{section.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{section.body}</p>
        </Card>
      ))}
      {p.cta ? (
        <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }))}>
          {p.cta}
        </Link>
      ) : null}
    </article>
  );
}

export function AiTechnologyContent() {
  const { page } = useTranslations();
  const p = page("ai-technology");
  if (!p) return null;

  return (
    <article className="space-y-8">
      <p className="max-w-3xl text-lg leading-relaxed text-muted">{p.intro}</p>
      {p.introSecondary ? <p className="max-w-3xl text-muted">{p.introSecondary}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {p.features?.map((item) => (
          <Card key={item.title} className="p-6">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </Card>
        ))}
      </div>
      {p.cta ? (
        <Link href="/trading" className={cn(buttonVariants({ variant: "accent" }))}>
          {p.cta}
        </Link>
      ) : null}
    </article>
  );
}

export function FeaturesPageContent() {
  const { page } = useTranslations();
  const p = page("features");
  if (!p) return null;

  return (
    <article className="space-y-8">
      <p className="max-w-3xl text-lg leading-relaxed text-muted">{p.intro}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {p.features?.map((item) => (
          <Card key={item.title} className="p-6">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </Card>
        ))}
      </div>
      {p.cta ? (
        <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }))}>
          {p.cta}
        </Link>
      ) : null}
    </article>
  );
}

export function ContactPageContent() {
  const { page, messages } = useTranslations();
  const p = page("contact");
  if (!p) return null;

  return (
    <article className="space-y-8">
      <p className="max-w-3xl text-lg text-muted">{p.intro}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {p.sections?.map((section) => (
          <Card key={section.title} className="p-6">
            <h3 className="font-semibold">{section.title}</h3>
            <p className="mt-2 text-sm text-muted">{section.body}</p>
          </Card>
        ))}
      </div>
      <Link href="/support-center" className={cn(buttonVariants({ variant: "outline" }))}>
        {messages.footer.supportCenter} →
      </Link>
    </article>
  );
}

export function FaqPageContent() {
  return <FaqAccordion />;
}

export function RiskDisclosureContent() {
  return (
    <article className="prose prose-invert max-w-3xl space-y-4 text-muted">
      <p>Trading involves substantial risk. Digital assets can be volatile. Past performance does not guarantee future results.</p>
      <p>
        Configured daily task rewards and platform earnings are administrative features—not guaranteed trading profits
        or evidence of live AI trading performance unless explicitly documented otherwise.
      </p>
      <p>Only commit capital you can afford to lose. Review terms and verify product eligibility in your jurisdiction.</p>
    </article>
  );
}

export function CookiePolicyContent() {
  return (
    <article className="prose prose-invert max-w-3xl space-y-4 text-muted">
      <p>
        CapitalCore AI uses cookies and similar technologies to keep you signed in, remember theme and language
        preferences, and improve platform performance.
      </p>
      <p>
        Essential cookies are required for authentication and security. You can control non-essential cookies through
        your browser settings.
      </p>
    </article>
  );
}

export function BlogPageContent() {
  return <BlogList />;
}

function BlogList() {
  const [posts, setPosts] = useState<{ slug: string; title: string; excerpt: string | null; publishedAt: string }[]>([]);

  useEffect(() => {
    void fetch("/api/blog")
      .then((r) => r.json())
      .then((data: { posts: typeof posts }) => setPosts(data.posts ?? []));
  }, []);

  if (posts.length === 0) {
    return <p className="text-muted">Platform news and education articles will appear here. Check back soon.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {posts.map((post) => (
        <Card key={post.slug} className="p-6">
          <p className="text-xs text-muted">{new Date(post.publishedAt).toLocaleDateString()}</p>
          <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
          <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
        </Card>
      ))}
    </div>
  );
}
