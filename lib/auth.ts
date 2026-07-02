import { type NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ensureWallet } from "@/lib/wallet";

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totp: { label: "2FA Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });
        if (!user?.passwordHash) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const { verifyTwoFactorToken } = await import("@/lib/two-factor");
          if (!credentials.totp || !verifyTwoFactorToken(user.twoFactorSecret, credentials.totp)) {
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          kycStatus: user.kycStatus,
        };
      },
    }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const isGoogleAuthEnabled =
  Boolean(process.env.GOOGLE_CLIENT_ID) && Boolean(process.env.GOOGLE_CLIENT_SECRET);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-email",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.kycStatus = user.kycStatus ?? "PENDING";
      } else if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, kycStatus: true },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.kycStatus = dbUser.kycStatus;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.kycStatus = token.kycStatus;
      }
      return session;
    },
    async signIn({ user }) {
      if (user.id) {
        await ensureWallet(user.id);
      }
      return true;
    },
  },
  events: {
    async createUser({ user }) {
      if (user.id) await ensureWallet(user.id);
    },
  },
};
