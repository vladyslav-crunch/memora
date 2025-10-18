import {NextResponse} from "next/server";
import {z, ZodError} from "zod";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";

import {ApiError} from "@/lib/types/api";
import {CreateDeckSchema} from "@/lib/validation/deck/create-deck.chema";

export const runtime = "nodejs";

const QuerySchema = z.object({
    take: z.coerce.number().min(1).max(100).optional(),
    skip: z.coerce.number().min(0).optional(),
});

export async function POST(req: Request) {
    try {
        const userId = await requireUserId();
        const data = CreateDeckSchema.parse(await req.json());

        const deck = await prisma.deck.create({
            data: {userId, ...data},
        });

        return NextResponse.json(deck, {status: 201});
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message, errors: err.errors}, {status: err.status});
        }
        if (err instanceof ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid body",
                    errors: err.issues.map(issue => ({field: issue.path.join("."), message: issue.message})),
                },
                {status: 400}
            );
        }
        console.error("Create deck error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

export async function GET(req: Request) {
    try {
        const userId = await requireUserId();

        const {searchParams} = new URL(req.url);
        const parsed = QuerySchema.safeParse({
            take: searchParams.get("take") ?? undefined,
            skip: searchParams.get("skip") ?? undefined,
        });

        let take: number | undefined = undefined;
        let skip: number | undefined = undefined;

        if (parsed.success) {
            take = parsed.data.take;
            skip = parsed.data.skip ?? 0; // default skip to 0
        }

        const [items, total] = await Promise.all([
            prisma.deck.findMany({
                where: {userId},
                orderBy: {createdAt: "desc"},
                take,
                skip,
            }),
            prisma.deck.count({where: {userId}}),
        ]);

        return NextResponse.json({items, total, take, skip});
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message, errors: err.errors}, {status: err.status});
        }
        console.error("List card-list error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

