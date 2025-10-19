// app/api/cards/import/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {bucketFromInterval, upsertUserProgressionEntry} from "@/lib/api/progression-helpers";
import {ensureDeckOwnership, requireUserId} from "@/lib/api/auth-helper";
import {ApiError} from "@/lib/types/api.types";
import {ImportCardsSchema} from "@/lib/validation/card/import-cards.schema";

export const runtime = "nodejs";


export async function POST(req: Request) {
    try {
        const userId = await requireUserId();
        const parsed = ImportCardsSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Invalid request body",
                    errors: parsed.error.issues.map((i) => ({
                        field: i.path.join("."),
                        message: i.message,
                    })),
                },
                {status: 400}
            );
        }


        const {deckId, cards} = parsed.data;
        await ensureDeckOwnership(deckId, userId);

        const now = new Date();

        // Create all cards in one transaction
        const created = await prisma.$transaction(async (tx) => {
            return await Promise.all(
                cards.map(async (c) => {
                    const card = await tx.card.create({
                        data: {
                            deckId,
                            front: c.front,
                            back: c.back,
                            context: c.context ?? null,
                            intervalStrength: c.intervalStrength ?? 0,
                            nextRepetitionTime: now,
                            createdAt: now,
                        },
                    });

                    const indication = bucketFromInterval(c.intervalStrength ?? 0);
                    await upsertUserProgressionEntry(tx, userId, card.id, indication, now);

                    return card;
                })
            );
        });

        return NextResponse.json({count: created.length, items: created}, {status: 201});
    } catch (err) {
        if (err instanceof ApiError) return NextResponse.json({error: err.message}, {status: err.status});
        console.error("Cards bulk import error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
