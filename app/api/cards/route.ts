// app/api/cards/route.ts
import {NextResponse} from "next/server";
import {z, ZodError} from "zod";
import {prisma} from "@/lib/prisma";
import {
    bucketFromInterval,
    upsertUserProgressionEntry,
} from "@/lib/api/progression-helpers";
import {ensureDeckOwnership, requireUserId} from "@/lib/api/auth-helper";
import {CreateCardSchema} from "@/lib/validation/card/card-shemas";
import {ApiError} from "@/lib/types/api";

export const runtime = "nodejs";

const listQuery = z.object({
    deckId: z.coerce.number().int(),
    take: z.coerce.number().int().positive().max(100).optional(),
    skip: z.coerce.number().int().min(0).optional(),
    search: z.string().min(1).max(200).optional(),
    sortBy: z.enum(["intervalStrength", "nextRepetitionTime", "createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});


export async function GET(req: Request) {
    try {
        const userId = await requireUserId();

        const parsed = listQuery.safeParse(
            Object.fromEntries(new URL(req.url).searchParams)
        );
        if (!parsed.success) {
            return NextResponse.json(
                {error: parsed.error},
                {status: 400}
            );
        }

        const {deckId, take, skip = 0, search} = parsed.data;
        const trimmedSearch = search?.trim();
        await ensureDeckOwnership(deckId, userId);

        const [items, total] = await Promise.all([
            prisma.card.findMany({
                where: {
                    deckId,
                    ...(trimmedSearch
                        ? {
                            OR: [
                                {front: {contains: trimmedSearch, mode: "insensitive"}},
                                {back: {contains: trimmedSearch, mode: "insensitive"}},
                            ],
                        }
                        : {}),
                },
                orderBy: parsed.data.sortBy
                    ? {[parsed.data.sortBy]: parsed.data.sortOrder ?? "asc"}
                    : {id: "asc"},
                take,
                skip,
            }),
            prisma.card.count({
                where: {
                    deckId,
                    ...(trimmedSearch
                        ? {
                            OR: [
                                {front: {contains: trimmedSearch, mode: "insensitive"}},
                                {back: {contains: trimmedSearch, mode: "insensitive"}},
                            ],
                        }
                        : {}),
                },
            }),
        ]);

        return NextResponse.json({items, total, take, skip});
    } catch (err) {
        if (err instanceof ApiError) return NextResponse.json({error: err.message}, {status: err.status});
        if (err instanceof ZodError) return NextResponse.json({
            error: "Invalid query",
            issues: err.issues
        }, {status: 400});
        console.error("Cards GET error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        const userId = await requireUserId();
        const parsed = CreateCardSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({error: parsed.error}, {status: 400});
        }

        const {deckId, front, back, context, intervalStrength} = parsed.data;
        await ensureDeckOwnership(deckId, userId);

        const now = new Date();
        const indication = bucketFromInterval(intervalStrength ?? 0);

        const created = await prisma.$transaction(async (tx) => {
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

            return card;
        });

        return NextResponse.json(created, {status: 201});
    } catch (err) {
        if (err instanceof ApiError) return NextResponse.json({error: err.message}, {status: err.status});
        if (err instanceof ZodError) return NextResponse.json({
            error: "Invalid body",
            issues: err.issues
        }, {status: 400});
        console.error("Cards POST error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

const deleteSchema = z.object({
    deckId: z.coerce.number().int(),
    cardIds: z.array(z.coerce.number().int()).nonempty(),
});

export async function DELETE(req: Request) {
    try {
        const userId = await requireUserId();
        const parsed = deleteSchema.safeParse(await req.json());

        if (!parsed.success) {
            return NextResponse.json(
                {error: parsed.error},
                {status: 400}
            );
        }

        const {deckId, cardIds} = parsed.data;
        await ensureDeckOwnership(deckId, userId);

        const deleted = await prisma.card.deleteMany({
            where: {
                deckId,
                id: {in: cardIds},
            },
        });

        return NextResponse.json(
            {deletedCount: deleted.count},
            {status: 200}
        );
    } catch (err) {
        if (err instanceof ApiError) return NextResponse.json({error: err.message}, {status: err.status});
        if (err instanceof ZodError) return NextResponse.json({
            error: "Invalid body",
            issues: err.issues
        }, {status: 400});
        console.error("Cards DELETE error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}