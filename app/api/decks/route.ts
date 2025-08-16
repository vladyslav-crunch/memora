// app/api/decks/route.ts
import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";

export const runtime = "nodejs";

const CreateSchema = z.object({
    name: z.string().min(1).max(200),
    isQuizNormal: z.boolean().optional().default(true),
    isQuizReversed: z.boolean().optional().default(false),
    isQuizTyping: z.boolean().optional().default(false),
    isQuizRandomized: z.boolean().optional().default(false),
    isPrivate: z.boolean().optional().default(false),
});

const QuerySchema = z.object({
    take: z.coerce.number().min(1).max(100).optional(),
    skip: z.coerce.number().min(0).optional(),
});

export async function POST(req: Request) {
    try {
        const userId = await requireUserId();
        const data = CreateSchema.parse(await req.json());

        const deck = await prisma.deck.create({
            data: {userId, ...data},
        });

        return NextResponse.json(deck, {status: 201});
    } catch (err: any) {
        if (err?.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        if (err?.name === "ZodError") {
            return NextResponse.json(
                {error: "Invalid body", issues: err.issues},
                {status: 400}
            );
        }
        console.error("Create deck error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
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
        const {take = 20, skip = 0} = parsed.success ? parsed.data : {take: 20, skip: 0};

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
    } catch (err: any) {
        if (err?.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        console.error("List decks error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
