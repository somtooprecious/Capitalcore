import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getOwnerEmails() {
  return (process.env.OWNER_EMAIL ?? "")
    .split(",")
    .map((email) => email.toLowerCase().trim())
    .filter(Boolean);
}

async function main() {
  const emails = getOwnerEmails();
  if (emails.length === 0) {
    console.error("No OWNER_EMAIL set in environment. Aborting.");
    process.exit(1);
  }

  console.log("Owner email(s) configured:", emails.join(", "));

  for (const email of emails) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`- No account found for ${email} (they may need to sign up first).`);
      continue;
    }

    if (user.role === "OWNER") {
      console.log(`- ${email} is already OWNER. No change needed.`);
      continue;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "OWNER" },
    });
    console.log(`- Promoted ${email} to OWNER.`);
  }
}

main()
  .catch((error) => {
    console.error("Failed to promote owner:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
