// app/api/cards/route.ts
import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {
    bucketFromInterval,
    recalcUserProgressionHistoryForToday,
    upsertUserProgressionEntry,
} from "@/lib/api/progression-helpers";
import {ensureDeckOwnership, requireUserId} from "@/lib/api/auth-helper";
import {CreateCardSchema} from "@/lib/validation/card/card-shemas";

export const runtime = "nodejs";

const listQuery = z.object({
    deckId: z.coerce.number().int(),
    take: z.coerce.number().int().positive().max(100).optional(),
    skip: z.coerce.number().int().min(0).optional(),
});


export async function GET(req: Request) {
    try {
        const userId = await requireUserId();
        const parsed = listQuery.safeParse(Object.fromEntries(new URL(req.url).searchParams));
        if (!parsed.success) {
            return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
        }

        const {deckId, take = 20, skip = 0} = parsed.data;
        await ensureDeckOwnership(deckId, userId);

        const [items, total] = await Promise.all([
            prisma.card.findMany({where: {deckId}, orderBy: {id: "asc"}, take, skip}),
            prisma.card.count({where: {deckId}}),
        ]);

        return NextResponse.json({items, total, take, skip});
    } catch (err: any) {
        if (err?.status) return NextResponse.json({error: err.message}, {status: err.status});
        console.error("Cards GET error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const userId = await requireUserId();
        const parsed = CreateCardSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
        }

        const {deckId, front, back, context, intervalStrength} = parsed.data;
        await ensureDeckOwnership(deckId, userId);

        const now = new Date();
        const indication = bucketFromInterval(intervalStrength ?? 0);

        const created = await prisma.$transaction(async (tx) => {
            // 1. create card
            const card = await tx.card.create({
                data: {
                    deckId,
                    front,
                    back,
                    context: context ?? null,
                    intervalStrength: intervalStrength ?? 0,
                    nextRepetitionTime: now,
                    createdAt: now,
                },
            });
            
            await upsertUserProgressionEntry(tx, userId, card.id, indication, now);
            await recalcUserProgressionHistoryForToday(tx, userId, now);

            return card;
        });

        return NextResponse.json(created, {status: 201});
    } catch (err: any) {
        if (err?.status) return NextResponse.json({error: err.message}, {status: err.status});
        console.error("Cards POST error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
