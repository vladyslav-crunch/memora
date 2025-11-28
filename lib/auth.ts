import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import {PrismaAdapter} from "@auth/prisma-adapter";
import {prisma} from "@/lib/prisma";
import {appendTokenToSession, appendUserIdToToken, authorizeCredentials} from "@/lib/api/auth-helper";

export const {
    auth,
    handlers: {GET, POST},
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt", maxAge: 60 * 60 * 24 * 30}, // 30 days
    providers: [
        Credentials({authorize: authorizeCredentials}),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {params: {prompt: "select_account"}},
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        jwt: ({token, user}) => appendUserIdToToken(token, user),
        session: ({session, token}) => appendTokenToSession(session, token),
    }
});




