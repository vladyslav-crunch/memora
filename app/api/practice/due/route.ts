// app/api/practice/due/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";

export async function GET(req: Request) {
    try {
        const userId = await requireUserId();

        // optional deckId filter
        const url = new URL(req.url);
        const deckIdParam = url.searchParams.get("deckId");
        const onlyDeckId = deckIdParam ? Number(deckIdParam) : undefined;

        // fetch card-list with cards
        const decks = await prisma.deck.findMany({
            where: onlyDeckId ? {userId, id: onlyDeckId} : {userId},
            include: {cards: true},
        });

        const now = new Date();
        let dueCount = 0;

        for (const deck of decks) {
            for (const card of deck.cards) {
                const isDue = !card.nextRepetitionTime || new Date(card.nextRepetitionTime) <= now;
                if (isDue) {
                    dueCount++;
                }
            }
        }

        return NextResponse.json({
            hasDue: dueCount > 0,
            count: dueCount,
        });
    } catch (err: any) {
        console.error("practice due GET error:", err);
        if (err?.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}
