import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Find the user that was just created/exists
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          // If user exists and is not verified, mark them as verified
          if (dbUser && !dbUser.verified) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { verified: true },
            });
          }
        } catch (error) {
          console.error("Error in signIn callback:", error);
          // Continue with sign-in even if verification update fails
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, redirect to dashboard
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id;

        // Fetch fresh user data to include verified status
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (dbUser) {
          session.user.verified = dbUser.verified;
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // When a new user is created via OAuth, mark them as verified
      const account = await prisma.account.findFirst({
        where: { userId: parseInt(user.id) },
      });

      if (account?.provider === "google") {
        await prisma.user.update({
          where: { id: parseInt(user.id) },
          data: { verified: true },
        });
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
