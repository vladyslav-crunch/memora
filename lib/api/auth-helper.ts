// lib/api/auth-helpers.ts
import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";
import {ApiError} from "@/lib/types/api.types";
import {SignInSchema} from "@/lib/validation/auth/sign-in.schema";
import bcrypt from "bcrypt";
import {JWT} from "@auth/core/jwt";
import {Session, User} from "next-auth";

/** Get the current user's [id] or null */
export async function getSessionUserId(): Promise<string | null> {
    const session = await auth();
    return session?.user?.id ?? null;
}

/** Get the current user's [id] or throw a 401 response you can return */
export async function requireUserId(): Promise<string> {
    const userId = await getSessionUserId();
    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }
    return userId;
}

/** Ensure the deck exists and belongs to userId; returns deck or throws 404 */
export async function ensureDeckOwnership(deckId: number, userId: string) {
    const deck = await prisma.deck.findUnique({where: {id: deckId}});
    if (!deck || deck.userId !== userId) {
        throw new ApiError(404, "Deck not found or not associated with this user.");
    }
    return deck;
}

/** Ensure the card exists and belongs to userId via its deck; returns card or throws 404 */
export async function ensureCardOwnership(cardId: number, userId: string) {
    const card = await prisma.card.findUnique({
        where: {id: cardId},
        include: {deck: true},
    });
    if (!card || card.deck.userId !== userId) {
        throw new ApiError(404, "Card not found.");
    }
    return card;
}

/** Authorize Credentials provider */
export async function authorizeCredentials(credentials: unknown) {
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
        name: user.name,
        image: user.image,
    };
}

/** Add user.id to JWT */
export function appendUserIdToToken(token: JWT, user: Pick<User, "id"> | null | undefined) {
    if (user?.id) token.sub = user.id;
    return token;
}

/** Add userId to session */
export function appendTokenToSession(session: Session, token: JWT) {
    if (session.user && typeof token.sub === "string") {
        session.user.id = token.sub;
    }
    return session;
}