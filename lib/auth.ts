// lib/auth.ts (Auth.js v5 with Google + Credentials)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CredentialsSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const {
    auth,               // server helper: const session = await auth()
    signIn,             // server action helper
    signOut,            // server action helper
    handlers: { GET, POST }, // route handlers for /api/auth/[...nextauth]
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 }, // 30 days
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const parsed = CredentialsSchema.safeParse(credentials);
                if (!parsed.success) return null;
                const { email, password } = parsed.data;

                const user = await prisma.user.findUnique({ where: { email } });
                if (!user?.passwordHash) return null; // handles google-only accounts

                const ok = await bcrypt.compare(password, user.passwordHash);
                if (!ok) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name ?? null,
                    image: user.image ?? null,
                };
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                },
            },
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.uid = (user as any).id as string;
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.uid) (session.user as any).id = token.uid as string;
            return session;
        },
    },
});
