// lib/api/auth-helpers.ts
import {auth} from "@/lib/auth";
import {prisma} from "@/lib/prisma";

/** Get the current user's [id] or null */
export async function getSessionUserId(): Promise<string | null> {
    const session = await auth();
    return session?.user?.id ?? null;
}

/** Get the current user's [id] or throw a 401 response you can return */
export async function requireUserId(): Promise<string> {
    const userId = await getSessionUserId();
    if (!userId) {
        const err = new Error("Unauthorized");
        (err as any).status = 401;
        throw err;
    }
    return userId;
}

/** Ensure the deck exists and belongs to userId; returns deck or throws 404 */
export async function ensureDeckOwnership(deckId: number, userId: string) {
    const deck = await prisma.deck.findUnique({where: {id: deckId}});
    if (!deck || deck.userId !== userId) {
        const err = new Error("Not found");
        (err as any).status = 404;
        throw err;
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
        const err = new Error("Not found");
        (err as any).status = 404;
        throw err;
    }
    return card;
}
