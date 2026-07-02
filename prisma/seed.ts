import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ensureWallet } from "../lib/wallet";

const prisma = new PrismaClient();

async function main() {
  const demoEmail = "demo@capitalcore.com";
  const demoPassword = "Password123!";
  const passwordHash = await bcrypt.hash(demoPassword, 12);
  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: { name: "Demo Investor", passwordHash },
    create: {
      name: "Demo Investor",
      email: demoEmail,
      passwordHash,
      kycStatus: "APPROVED",
    },
  });
  await ensureWallet(demoUser.id);
  await prisma.wallet.update({
    where: { userId: demoUser.id },
    data: { balance: 248440.23, cryptoBtc: 74532.07 },
  });

  const ownerEmail = process.env.OWNER_EMAIL ?? "owner@capitalcore.com";
  const ownerPassword = process.env.OWNER_PASSWORD ?? "OwnerPassword123!";
  const ownerHash = await bcrypt.hash(ownerPassword, 12);
  const ownerUser = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { role: "OWNER", name: "Site Owner", passwordHash: ownerHash, kycStatus: "APPROVED" },
    create: {
      name: "Site Owner",
      email: ownerEmail,
      passwordHash: ownerHash,
      role: "OWNER",
      kycStatus: "APPROVED",
    },
  });
  await ensureWallet(ownerUser.id);

  console.log(`Owner account: ${ownerEmail} / ${ownerPassword}`);

  const plans = [
    {
      name: "Starter",
      minDeposit: 100,
      roiPercent: 6,
      durationDay: 14,
      features: ["Beginner friendly", "Portfolio insights"],
    },
    {
      name: "Silver",
      minDeposit: 1000,
      roiPercent: 12,
      durationDay: 30,
      features: ["Priority support", "Lower fees"],
    },
    {
      name: "Gold",
      minDeposit: 5000,
      roiPercent: 18,
      durationDay: 45,
      features: ["Dedicated analyst", "Advanced tools"],
    },
    {
      name: "Premium",
      minDeposit: 20000,
      roiPercent: 25,
      durationDay: 60,
      features: ["Private desk", "Custom strategies"],
    },
  ];

  for (const plan of plans) {
    await prisma.investmentPlan.upsert({
      where: { name: plan.name },
      update: plan,
      create: plan,
    });
  }

  const { seedPlatformDefaults } = await import("../lib/platform-config");
  await seedPlatformDefaults();

  await prisma.dailyTask.upsert({
    where: { id: "seed-daily-task" },
    update: {},
    create: {
      id: "seed-daily-task",
      title: "Daily platform check-in",
      description: "Complete today's configured task to earn an admin-set reward.",
      rewardType: "FIXED",
      rewardValue: 5,
      isActive: true,
    },
  });

  const faqs = [
    { question: "Are daily task rewards real AI trading profits?", answer: "No. They are configurable platform rewards set by administrators.", sortOrder: 1 },
    { question: "How do I deposit?", answer: "Use the Deposits page to generate crypto deposit details. Admin confirms funding.", sortOrder: 2 },
    { question: "How do withdrawals work?", answer: "Submit a request from your dashboard. Withdrawals are reviewed and approved by admin.", sortOrder: 3 },
  ];
  for (const faq of faqs) {
    const existing = await prisma.faqItem.findFirst({ where: { question: faq.question } });
    if (!existing) await prisma.faqItem.create({ data: faq });
  }

  const blogPosts = [
    {
      slug: "welcome-capitalcore-ai",
      title: "Welcome to CapitalCore AI",
      excerpt: "Introducing our modern trading workspace with configurable rewards and crypto treasury.",
      content: "CapitalCore AI combines professional dashboards, daily tasks, and admin-managed platform rules.",
      published: true,
      publishedAt: new Date(),
    },
    {
      slug: "understanding-daily-tasks",
      title: "Understanding daily tasks and rewards",
      excerpt: "How configured platform rewards work—and what they are not.",
      content: "Daily task rewards are set by administrators and are not live autonomous AI trading profits.",
      published: true,
      publishedAt: new Date(),
    },
  ];
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
