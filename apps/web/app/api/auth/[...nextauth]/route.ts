import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;

      const email = user.email;
      if (!email) return false;

      let dbUser = await db.user.findUnique({ where: { email } });
      if (!dbUser) {
        dbUser = await db.user.create({
          data: {
            email,
            name: user.name || null,
            role: "CUSTOMER",
          },
        });
      }

      const token = await signToken({
        userId: dbUser.id,
        email: dbUser.email,
        role: dbUser.role,
      });

      return `/auth/callback?token=${token}`;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
