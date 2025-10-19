import {NextResponse} from "next/server";
import {z, ZodError} from "zod";
import {prisma} from "@/lib/prisma";
import {ApiError} from "@/lib/types/api.types";

export const runtime = "nodejs";

// Query validation
const QuerySchema = z.object({
    take: z.coerce.number().min(1).max(100).optional(),
    skip: z.coerce.number().min(0).optional(),
    search: z.string().min(1).max(200).optional(),
    sortBy: z.enum(["createdAt", "cardCount"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
});

export async function GET(req: Request) {
    try {
        const {searchParams} = new URL(req.url);
        const parsed = QuerySchema.safeParse({
            take: searchParams.get("take") ?? undefined,
            skip: searchParams.get("skip") ?? undefined,
            search: searchParams.get("search")?.trim() || undefined,
        });

        const {take, skip = 0, sortBy = "createdAt", sortOrder = "desc"} = parsed.success
            ? parsed.data
            : {sortBy: "createdAt", sortOrder: "desc"};

        // Fetch public decks
        const [decks, total] = await Promise.all([
            prisma.deck.findMany({
                where: {
                    isPrivate: false,
                    ...(parsed?.data?.search
                        ? {name: {contains: parsed.data.search, mode: "insensitive"}}
                        : {}),
                },
                orderBy:
                    sortBy === "cardCount"
                        ? {cards: {_count: sortOrder}} // sort by card count
                        : {[sortBy]: sortOrder},
                take: take ?? undefined, // no limit if undefined
                skip,
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    user: {
                        select: {
                            name: true,
                            image: true,
                        },
                    },
                    _count: {select: {cards: true}},
                },
            }),
            prisma.deck.count({
                where: {
                    isPrivate: false,
                    ...(parsed?.data?.search
                        ? {name: {contains: parsed.data.search, mode: "insensitive"}}
                        : {}),
                },
            }),
        ]);

        // Shape response
        const items = decks.map((d) => ({
            id: d.id,
            name: d.name,
            createdAt: d.createdAt,
            owner: {
                name: d.user.name,
                image: d.user.image,
            },
            cardCount: d._count.cards,
        }));

        return NextResponse.json({
            items,
            total,
            take,
            skip,
        });
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json(
                {message: err.message, errors: err.errors},
                {status: err.status}
            );
        }

        if (err instanceof ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid query",
                    errors: err.issues.map((i) => ({
                        field: i.path.join("."),
                        message: i.message,
                    })),
                },
                {status: 400}
            );
        }

        console.error("Public decks error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
