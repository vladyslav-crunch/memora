// app/api/cards/[id]/route.ts
import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {ensureCardOwnership, requireUserId} from "@/lib/api/auth-helper";
import {ApiError} from "@/lib/types/api.types";

export const runtime = "nodejs";

const idParam = z.coerce.number().int();

const updateSchema = z.object({
    front: z.string().min(1).optional(),
    back: z.string().min(1).optional(),
    context: z.string().nullable().optional(),
    intervalStrength: z.number().min(0).max(1).nullable().optional(),
    nextRepetitionTime: z.string().datetime().optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {id} = await ctx.params;
        const cardId = idParam.parse(id);
        const card = await ensureCardOwnership(cardId, userId);
        return NextResponse.json(card);
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json(
                {message: err.message, errors: err.errors},
                {status: err.status}
            );
        }
        console.error("Card GET error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {id} = await ctx.params;
        const cardId = idParam.parse(id);
        await ensureCardOwnership(cardId, userId);

        const parsed = updateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
        }

        const {nextRepetitionTime, ...rest} = parsed.data;

        const updated = await prisma.card.update({
            where: {id: cardId},
            data: {
                ...rest,
                ...(nextRepetitionTime ? {nextRepetitionTime: new Date(nextRepetitionTime)} : {}),
            },
        });

        return NextResponse.json(updated);
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json(
                {message: err.message, errors: err.errors},
                {status: err.status}
            );
        }
        console.error("Card PUT error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {id} = await ctx.params;
        const cardId = idParam.parse(id);
        await ensureCardOwnership(cardId, userId);
        await prisma.card.delete({where: {id: cardId}});
        return NextResponse.json({success: true});
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json(
                {message: err.message, errors: err.errors},
                {status: err.status}
            );
        }
        console.error("Card DELETE error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}