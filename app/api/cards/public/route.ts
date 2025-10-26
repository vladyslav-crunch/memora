// app/api/public-cards/route.ts
import {NextResponse} from "next/server";
import {z, ZodError} from "zod";
import {prisma} from "@/lib/prisma";

export const runtime = "nodejs";

const publicListQuery = z.object({
    deckId: z.coerce.number().int(),
    take: z.coerce.number().int().positive().max(100).optional(),
    skip: z.coerce.number().int().min(0).optional(),
    search: z.string().min(1).max(200).optional(),
    sortBy: z.enum(["createdAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

export async function GET(req: Request) {
    try {
        const parsed = publicListQuery.safeParse(
            Object.fromEntries(new URL(req.url).searchParams)
        );

        if (!parsed.success) {
            return NextResponse.json({error: parsed.error}, {status: 400});
        }

        const {deckId, take, skip = 0, search} = parsed.data;
        const trimmedSearch = search?.trim();

        const deck = await prisma.deck.findUnique({
            where: {id: deckId},
            select: {isPrivate: true},
        });

        if (!deck || deck.isPrivate) {
            return NextResponse.json(
                {error: "Deck not found or is private"},
                {status: 403}
            );
        }

        const where = {
            deckId,
            ...(trimmedSearch && {
                OR: [
                    {
                        front: {
                            contains: trimmedSearch,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        back: {
                            contains: trimmedSearch,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        context: {
                            contains: trimmedSearch,
                            mode: "insensitive" as const,
                        },
                    },
                ],
            }),
        };


        const [items, total] = await Promise.all([
            prisma.card.findMany({
                where,
                select: {
                    id: true,
                    front: true,
                    back: true,
                    context: true,
                },
                orderBy:
                    parsed.data.sortBy
                        ? {[parsed.data.sortBy]: parsed.data.sortOrder ?? "asc"}
                        : {id: "asc"},
                take,
                skip,
            }),
            prisma.card.count({where}),
        ]);

        return NextResponse.json({items, total, take, skip});
    } catch (err) {
        if (err instanceof ZodError) {
            return NextResponse.json(
                {error: "Invalid query", issues: err.issues},
                {status: 400}
            );
        }
        console.error("Public Cards GET error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
