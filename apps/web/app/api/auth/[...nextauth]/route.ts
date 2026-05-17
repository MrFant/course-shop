import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { db } = await import("@/lib/db");
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
        return true;
      }
      return false;
    },
  },
});

export { handler as GET, handler as POST };
