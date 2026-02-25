import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getDatabase } from "@/lib/db/mongodb";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      const db = await getDatabase();
      const users = db.collection("users");

      const existingUser = await users.findOne({
        email: user.email,
      });

      if (!existingUser) {
        await users.insertOne({
          email: user.email,
          name: user.name,
          image: user.image,
          role: "farmer",
          loginAttempts: 0,
          loginBlockedUntil: null,
          provider: "google",
          createdAt: new Date(),
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const db = await getDatabase();
        const users = db.collection("users");

        const dbUser = await users.findOne({
          email: user.email,
        });

        token.id = dbUser._id.toString();
        token.role = dbUser.role;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };