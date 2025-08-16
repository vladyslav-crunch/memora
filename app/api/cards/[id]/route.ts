// app/api/cards/[id]/route.ts
import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {ensureCardOwnership, requireUserId} from "@/lib/api/auth-helper";

export const runtime = "nodejs";

const idParam = z.coerce.number().int();

const updateSchema = z.object({
    front: z.string().min(1).optional(),
    back: z.string().min(1).optional(),
    context: z.string().nullable().optional(),
    intervalStrength: z.number().min(0).max(1).nullable().optional(),
    nextRepetitionTime: z.string().datetime().optional(),
});

export async function GET(_req: Request, ctx: { params: { id: string } }) {
    try {
        const userId = await requireUserId();
        const id = idParam.parse(ctx.params.id);
        const card = await ensureCardOwnership(id, userId);
        return NextResponse.json(card);
    } catch (err: any) {
        if (err?.status) return NextResponse.json({error: err.message}, {status: err.status});
        console.error("Card GET error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function PUT(req: Request, ctx: { params: { id: string } }) {
    try {
        const userId = await requireUserId();
        const id = idParam.parse(ctx.params.id);
        await ensureCardOwnership(id, userId);

        const parsed = updateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({error: parsed.error.flatten()}, {status: 400});
        }

        const {nextRepetitionTime, ...rest} = parsed.data;

        const updated = await prisma.card.update({
            where: {id},
            data: {
                ...rest,
                ...(nextRepetitionTime ? {nextRepetitionTime: new Date(nextRepetitionTime)} : {}),
            },
        });

        return NextResponse.json(updated);
    } catch (err: any) {
        if (err?.status) return NextResponse.json({error: err.message}, {status: err.status});
        console.error("Card PUT error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
    try {
        const userId = await requireUserId();
        const id = idParam.parse(ctx.params.id);
        await ensureCardOwnership(id, userId);
        await prisma.card.delete({where: {id}});
        return NextResponse.json({success: true});
    } catch (err: any) {
        if (err?.status) return NextResponse.json({error: err.message}, {status: err.status});
        console.error("Card DELETE error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
