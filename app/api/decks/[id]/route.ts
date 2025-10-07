// app/api/card-list/[[id]]/route.ts
import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";

export const runtime = "nodejs";

const IdParam = z.object({
    id: z.coerce.number().int(),
});

const EditSchema = z.object({
    name: z.string().min(1).max(200).optional(),
    isQuizNormal: z.boolean().optional(),
    isQuizReversed: z.boolean().optional(),
    isQuizTyping: z.boolean().optional(),
    isQuizRandomized: z.boolean().optional(),
    isPrivate: z.boolean().optional(),
});

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {id} = IdParam.parse(await context.params);

        const deck = await prisma.deck.findFirst({where: {id, userId}});
        if (!deck) return NextResponse.json({error: "Not found"}, {status: 404});

        return NextResponse.json(deck);
    } catch (err: any) {
        if (err?.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        if (err?.name === "ZodError") {
            return NextResponse.json({error: "Invalid [id]", issues: err.issues}, {status: 400});
        }
        console.error("Get deck error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {id} = IdParam.parse(await context.params);
        const data = EditSchema.parse(await req.json());

        const existing = await prisma.deck.findFirst({where: {id, userId}});
        if (!existing) return NextResponse.json({error: "Not found"}, {status: 404});

        const updated = await prisma.deck.update({where: {id}, data});
        return NextResponse.json(updated);
    } catch (err: any) {
        if (err?.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        if (err?.name === "ZodError") {
            return NextResponse.json(
                {error: "Invalid body or [id]", issues: err.issues},
                {status: 400}
            );
        }
        console.error("Update deck error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {id} = IdParam.parse(await context.params);

        const existing = await prisma.deck.findFirst({where: {id, userId}});
        if (!existing) return NextResponse.json({error: "Not found"}, {status: 404});

        await prisma.deck.delete({where: {id}});
        return NextResponse.json({success: true});
    } catch (err: any) {
        if (err?.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        if (err?.name === "ZodError") {
            return NextResponse.json({error: "Invalid [id]", issues: err.issues}, {status: 400});
        }
        console.error("Delete deck error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
