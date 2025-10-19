// app/api/card-list/stats/route.ts
import {NextResponse} from "next/server";
import {z, ZodError} from "zod";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {ApiError} from "@/lib/types/api.types";

export const runtime = "nodejs";

const QuerySchema = z.object({
    take: z.coerce.number().min(1).max(100).optional(),
    skip: z.coerce.number().min(0).optional(),
    search: z.string().min(1).max(200).optional(),
});

export async function GET(req: Request) {
    try {
        const userId = await requireUserId();

        const {searchParams} = new URL(req.url);
        const parsed = QuerySchema.safeParse({
            take: searchParams.get("take") ?? undefined,
            skip: searchParams.get("skip") ?? undefined,
            search: searchParams.get("search")?.trim() || undefined, // trim spaces
        });

        const {take, skip = 0} = parsed.success ? parsed.data : {skip: 0};

        // 1) Fetch paginated card-list + total card count
        const [decks, totalDecks] = await Promise.all([
            prisma.deck.findMany({
                where: {
                    userId,
                    ...(parsed?.data?.search
                        ? {name: {contains: parsed.data.search, mode: "insensitive"}}
                        : {}),
                },
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
            prisma.deck.count({
                where: {
                    userId,
                    ...(parsed?.data?.search
                        ? {name: {contains: parsed.data.search, mode: "insensitive"}}
                        : {}),
                },
            }),
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

        // 2) Compute due counts
        const now = new Date();
        const dueGroups = await prisma.card.groupBy({
            by: ["deckId"],
            where: {
                deckId: {in: deckIds},
                nextRepetitionTime: {lte: now}, // nulls excluded
            },
            _count: {_all: true},
        });
        const dueMap = new Map<number, number>(
            dueGroups.map(g => [g.deckId, g._count._all])
        );

        // 3) Compute closest next repetition per deck
        const upcomingGroups = await prisma.card.groupBy({
            by: ["deckId"],
            where: {
                deckId: {in: deckIds},
                nextRepetitionTime: {gt: now}, // only future repetitions
            },
            _min: {nextRepetitionTime: true},
        });
        const upcomingMap = new Map<number, Date | null>(
            upcomingGroups.map(g => [g.deckId, g._min.nextRepetitionTime])
        );

        // 4) Merge & shape response
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
            nextRepetition: upcomingMap.get(d.id) ?? null,
        }));

        return NextResponse.json({items, total: totalDecks, take, skip});
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message, errors: err.errors}, {status: err.status});
        }
        if (err instanceof ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid query",
                    errors: err.issues.map(i => ({field: i.path.join("."), message: i.message}))
                },
                {status: 400}
            );
        }

        console.error("Deck stats error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
