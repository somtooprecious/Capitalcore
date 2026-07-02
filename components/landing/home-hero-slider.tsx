"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, ClipboardCheck, Lock, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { ProText } from "@/components/landing/pro-text";
import { useTranslations } from "@/hooks/use-translations";
import { cn } from "@/lib/utils";

const SLIDE_COUNT = 2;
const AUTOPLAY_MS = 8000;

const fadeTransition = {
  duration: 0.75,
  ease: [0.22, 1, 0.36, 1] as const,
};

const operateIcons = [ClipboardCheck, Lock, TrendingUp] as const;

export function HomeHeroSlider() {
  const { home } = useTranslations();
  const h = home.hero;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setIndex(((i % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_COUNT);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative isolate border-b border-border/40 pb-12 pt-4 md:pb-16 md:pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Home highlights"
    >
      <div className="relative mx-auto grid min-h-[min(90vh,640px)] w-full grid-cols-1 grid-rows-1 md:min-h-[580px]">
        <AnimatePresence initial={false} mode="wait">
          {index === 0 ? (
            <motion.div
              key="hero-original"
              role="group"
              aria-roledescription="slide"
              aria-label="Slide 1 of 2"
              className="col-start-1 row-start-1 flex min-h-[inherit] w-full min-w-0 items-stretch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 md:gap-x-10 md:py-20 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-12">
                <div className="max-w-xl space-y-5 md:max-w-2xl md:space-y-6 lg:col-span-5 lg:max-w-none lg:space-y-7 lg:self-center">
                  <p className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs tracking-wide text-amber-200">
                    <BadgeCheck size={14} className="shrink-0 text-amber-400" aria-hidden />
                    {h.badge}
                  </p>
                  <ProText
                    as="h1"
                    text={h.title}
                    className="text-balance text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl sm:leading-[1.1] lg:text-[3.35rem] lg:leading-[1.08] xl:text-6xl xl:leading-[1.06]"
                  />
                  <ProText
                    as="p"
                    text={h.subtitle}
                    className="max-w-[42ch] text-pretty text-base leading-relaxed text-muted md:text-lg md:leading-relaxed"
                    delay={0.1}
                  />
                  <div className="flex flex-row flex-wrap gap-3 pt-1">
                    <Link href="/signup" className={cn(buttonVariants({ variant: "default" }))}>
                      {h.startTrading}
                    </Link>
                    <Link href="/how-it-works" className={cn(buttonVariants({ variant: "outline" }))}>
                      {h.learnMore}
                    </Link>
                  </div>
                </div>
                <aside className="lg:col-span-7 lg:self-center">
                  <Card className="flex h-full w-full flex-col border-border/80 bg-card/90 p-5 backdrop-blur-sm sm:p-6">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                          {h.operateLabel}
                        </p>
                        <h3 className="text-base font-bold leading-snug text-foreground sm:text-lg">
                          {h.operateTitle}
                        </h3>
                      </div>
                      <ul className="flex flex-col gap-3">
                        {h.operateItems.map((item, i) => {
                          const Icon = operateIcons[i] ?? ClipboardCheck;
                          return (
                            <li
                              key={item.title}
                              className="flex flex-row items-start gap-3 rounded-xl border border-border/50 bg-background/40 p-3"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-primary">
                                <Icon className="h-4 w-4" aria-hidden />
                              </span>
                              <span className="min-w-0 flex-1 text-sm leading-snug text-muted">
                                <span className="block font-medium text-foreground">{item.title}</span>
                                <span className="mt-0.5 block text-xs leading-relaxed sm:text-sm">{item.body}</span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="mt-5 flex flex-row flex-wrap gap-3 border-t border-border/50 pt-5">
                      <Link href="/trading" className={cn(buttonVariants({ variant: "outline" }), "min-w-[8rem] flex-1")}>
                        {h.openTrading}
                      </Link>
                      <Link
                        href="/kyc-verification"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "min-w-[8rem] flex-1 border-transparent bg-transparent hover:bg-white/5",
                        )}
                      >
                        {h.howVerification}
                      </Link>
                    </div>
                  </Card>
                </aside>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hero-meeting"
              role="group"
              aria-roledescription="slide"
              aria-label="Slide 2 of 2"
              className="relative col-start-1 row-start-1 min-h-[min(90vh,640px)] w-full min-w-0 overflow-hidden md:min-h-[580px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <Image
                src="/images/hero-slide-meeting.png"
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 1}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/35" />
              <div className="relative z-10 mx-auto flex min-h-[inherit] max-w-7xl flex-col justify-center px-4 py-20 md:py-24">
                <div className="max-w-2xl space-y-6">
                  <p className="inline-flex w-fit rounded-full border border-border/80 bg-background/50 px-3 py-1 text-xs uppercase tracking-wide text-muted backdrop-blur-sm">
                    {h.slide2Badge}
                  </p>
                  <h2 className="text-4xl font-bold leading-tight text-foreground md:text-5xl">
                    {h.slide2Title}
                  </h2>
                  <p className="text-lg text-muted">{h.slide2Body}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/signup" className={cn(buttonVariants({ variant: "accent" }))}>
                      {h.register}
                    </Link>
                    <Link
                      href="/signin"
                      className={cn(buttonVariants({ variant: "outline" }), "border-accent/60 text-foreground hover:bg-accent/10")}
                    >
                      {h.login}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="pointer-events-none absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 md:right-5"
        aria-hidden
      >
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            className={cn(
              "pointer-events-auto h-8 w-1.5 rounded-full transition-colors duration-300",
              i === index ? "bg-accent" : "bg-border hover:bg-muted-foreground/50",
            )}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
