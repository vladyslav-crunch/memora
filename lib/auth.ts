import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import {PrismaAdapter} from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import {prisma} from "@/lib/prisma";
import {SignInSchema} from "@/lib/validation/auth/auth-schemas";

export const {
    auth,
    signOut,
    handlers: {GET, POST},
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt", maxAge: 60 * 60 * 24 * 30}, // 30 days
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"},
            },
            authorize: async (credentials) => {
                const parsed = SignInSchema.safeParse(credentials);
                if (!parsed.success) return null;
                const email = parsed.data.email.toLowerCase().trim();
                const {password} = parsed.data;

                const user = await prisma.user.findUnique({where: {email}});
                if (!user?.passwordHash) return null;

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
        async jwt({token, user}) {
            if (user?.id) token.sub = user.id;
            return token;
        },
        async session({session, token}) {
            if (session.user && typeof token.sub === "string") {
                session.user.id = token.sub;
            }
            return session;
        }
    }
});
