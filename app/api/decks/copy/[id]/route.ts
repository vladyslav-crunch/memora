import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {bucketFromInterval, upsertUserProgressionEntry} from "@/lib/api/progression-helpers";
import {requireUserId} from "@/lib/api/auth-helper";
import {ApiError} from "@/lib/types/api.types";

export const runtime = "nodejs";

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {id} = await context.params;
        const now = new Date();

        const originalDeck = await prisma.deck.findUnique({
            where: {id: Number(id)},
            include: {
                cards: true,
                user: true,
            },
        });

        if (!originalDeck) {
            return NextResponse.json({message: "Deck not found"}, {status: 404});
        }

        if (originalDeck.userId === userId) {
            return NextResponse.json({message: "You already own this deck"}, {status: 400});
        }

        if (originalDeck.isPrivate) {
            return NextResponse.json({message: "This deck is private"}, {status: 403});
        }

        const {name, isQuizNormal, isQuizRandomized, isQuizReversed, isQuizTyping} = originalDeck;

        const result = await prisma.$transaction(async (tx) => {
            const newDeck = await tx.deck.create({
                data: {
                    name: `${name} (copy)`,
                    isQuizNormal,
                    isQuizReversed,
                    isQuizTyping,
                    isQuizRandomized,
                    isPrivate: true,
                    userId
                },
            });

            await Promise.all(
                originalDeck.cards.map(async (c) => {
                    const card = await tx.card.create({
                        data: {
                            deckId: newDeck.id,
                            front: c.front,
                            back: c.back,
                            context: c.context,
                            intervalStrength: 0,
                            nextRepetitionTime: now,
                            createdAt: now,
                        },
                    });

                    const indication = bucketFromInterval(0);
                    await upsertUserProgressionEntry(tx, userId, card.id, indication, now);
                })
            );

            return {
                newDeckId: newDeck.id,
                copiedCount: originalDeck.cards.length,
            };
        });

        return NextResponse.json(result, {status: 201});
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message, errors: err.errors}, {status: err.status});
        }
        console.error("Copy deck error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
