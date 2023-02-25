import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers";
import { boolean } from "boolean";

const providers: Provider[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  );
}

if (
  boolean(process.env.DEBUG_LOGIN) ||
  process.env.NODE_ENV === "development"
) {
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
    },
    async authorize(credentials) {
      if (!credentials || credentials.username === "fail") return null;

      const user = {
        id: credentials.username,
        name: "John Doe",
        email: "jd@example.com",
      };

      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });

      return user;
    },
  });
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
};

export default NextAuth(authOptions);
