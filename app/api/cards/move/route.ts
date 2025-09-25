import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {ensureCardOwnership} from "@/lib/api/auth-helper";

export const runtime = "nodejs";

const moveSchema = z.object({
    cardIds: z.array(z.number().int().positive()),
    newDeckId: z.number().int().positive(),
});

export async function PUT(req: Request) {
    try {
        const userId = await requireUserId();
        const body = await req.json();

        const parsed = moveSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({error: parsed.error}, {status: 400});
        }

        const {cardIds, newDeckId} = parsed.data;

        // 🔒 Ensure user owns all the cards before moving
        for (const cardId of cardIds) {
            await ensureCardOwnership(cardId, userId);
        }

        // 🔒 Also ensure user owns the target deck
        const targetDeck = await prisma.deck.findUnique({
            where: {id: newDeckId},
        });
        if (!targetDeck || targetDeck.userId !== userId) {
            return NextResponse.json({error: "You do not own the target deck"}, {status: 403});
        }

        // ✅ Move cards
        const updated = await prisma.card.updateMany({
            where: {id: {in: cardIds}},
            data: {deckId: newDeckId},
        });

        return NextResponse.json({
            success: true,
            movedCount: updated.count,
        });
    } catch (err: any) {
        if (err?.status) {
            return NextResponse.json({error: err.message}, {status: err.status});
        }
        console.error("Cards MOVE error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
