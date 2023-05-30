// this is the next-auth api endpoint file
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

// Prisma is middleman between Next app and MongoDB
const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
        // TS, put as string when copy docs
        // do not overwrite TS compiler normally.
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      console.log("INSIDE OF SESSION CALLBACK")
      // creating user object that has session and user properties
      return { ...session, user: { ...session.user, ...user } };
    }
  }
})