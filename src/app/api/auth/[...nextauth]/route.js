import NextAuth from "next-auth";
import GoogleProvider   from "next-auth/providers/google";
import GithubProvider   from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import { getDatabase }  from "@/lib/db/mongodb";
import { COLLECTIONS, getCollection } from "@/lib/db/collections";
import { createSession } from "@/lib/auth/session";
import { USER_ROLES }   from "@/lib/constants/roles";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId:     process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],

  session: { strategy: "jwt" },
  secret:  process.env.NEXT_AUTH_SECRET,

  callbacks: {
    // Runs on every OAuth sign-in.
    // Creates the user in MongoDB if they don't exist, then generates
    // our own custom JWT — the same kind credentials login produces.
    async signIn({ user, account }) {
      try {
        const db              = await getDatabase();
        const usersCollection = getCollection(db, COLLECTIONS.USERS);

        let dbUser = await usersCollection.findOne({ email: user.email });

        if (!dbUser) {
          // First-time OAuth user → insert into the shared users collection
          const doc = {
            email:              user.email,
            name:               user.name,
            image:              user.image || null,
            password:           null,            // no password for OAuth users
            role:               USER_ROLES.FARMER, // default role
            providers:          [account.provider],
            loginAttempts:      0,
            loginBlockedUntil:  null,
            status:             'active',
            createdAt:          new Date(),
            updatedAt:          new Date(),
          };
          const result = await usersCollection.insertOne(doc);
          dbUser = { ...doc, _id: result.insertedId };
        } else {
          // Returning user → link provider if not already linked
          if (!dbUser.providers?.includes(account.provider)) {
            await usersCollection.updateOne(
              { _id: dbUser._id },
              {
                $addToSet: { providers: account.provider },
                $set:      { updatedAt: new Date() },
              }
            );
          }
        }

        // Generate our custom JWT + DB session (identical to credentials login)
        const { token } = await createSession(dbUser._id.toString(), {
          email: dbUser.email,
          role:  dbUser.role,
        });

        // Pass the custom token through to the jwt() callback via the user object
        user.customToken = token;
        user.dbId        = dbUser._id.toString();
        user.role        = dbUser.role;

        return true;
      } catch (err) {
        console.error("OAuth signIn error:", err);
        return false;
      }
    },

    // Stores our custom token inside NextAuth's JWT payload
    async jwt({ token, user }) {
      if (user?.customToken) {
        token.customToken = user.customToken;
        token.dbId        = user.dbId;
        token.role        = user.role;
      }
      return token;
    },

    // Exposes the custom token to the client via useSession()
    async session({ session, token }) {
      session.customToken  = token.customToken;
      session.user.id      = token.dbId;
      session.user.role    = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };