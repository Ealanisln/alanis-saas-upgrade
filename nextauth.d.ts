import 'next-auth/jwt'
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}

interface User {
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      role: string;
      image?: string;
    } & DefaultSession["user"];
  }
}
