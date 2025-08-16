// app/api/decks/stats/route.ts
import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";

export const runtime = "nodejs";

const QuerySchema = z.object({
    take: z.coerce.number().min(1).max(100).optional(),
    skip: z.coerce.number().min(0).optional(),
});

export async function GET(req: Request) {
    try {
        const userId = await requireUserId();

        const {searchParams} = new URL(req.url);
        const parsed = QuerySchema.safeParse({
            take: searchParams.get("take") ?? undefined,
            skip: searchParams.get("skip") ?? undefined,
        });
        const {take = 20, skip = 0} = parsed.success ? parsed.data : {take: 20, skip: 0};

        // 1) Fetch paginated decks + total card count
        const [decks, totalDecks] = await Promise.all([
            prisma.deck.findMany({
                where: {userId},
                orderBy: {createdAt: "desc"},
                take,
                skip,
                select: {
                    id: true,
                    name: true,
                    isQuizNormal: true,
                    isQuizReversed: true,
                    isQuizTyping: true,
                    isQuizRandomized: true,
                    isPrivate: true,
                    createdAt: true,
                    _count: {select: {cards: true}}, // totalCards
                },
            }),
            prisma.deck.count({where: {userId}}),
        ]);

        const deckIds = decks.map(d => d.id);
        if (deckIds.length === 0) {
            return NextResponse.json({
                items: [],
                total: totalDecks,
                take,
                skip,
            });
        }

        // 2) Compute due counts in one query via groupBy
        const now = new Date();
        const dueGroups = await prisma.card.groupBy({
            by: ["deckId"],
            where: {
                deckId: {in: deckIds},
                nextRepetitionTime: {lte: now}, // nulls are excluded automatically
            },
            _count: {_all: true},
        });
        const dueMap = new Map<number, number>(
            dueGroups.map(g => [g.deckId, g._count._all])
        );

        // 3) Merge & shape response
        const items = decks.map(d => ({
            id: d.id,
            name: d.name,
            isQuizNormal: d.isQuizNormal,
            isQuizReversed: d.isQuizReversed,
            isQuizTyping: d.isQuizTyping,
            isQuizRandomized: d.isQuizRandomized,
            isPrivate: d.isPrivate,
            createdAt: d.createdAt,
            counts: {
                totalCards: d._count.cards,
                dueCards: dueMap.get(d.id) ?? 0,
            },
        }));

        return NextResponse.json({items, total: totalDecks, take, skip});
    } catch (err: any) {
        if (err?.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        if (err?.name === "ZodError") {
            return NextResponse.json(
                {error: "Invalid query", issues: err.issues},
                {status: 400}
            );
        }
        console.error("Deck stats error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
