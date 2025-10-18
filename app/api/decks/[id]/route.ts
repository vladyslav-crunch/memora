// app/api/card-list/[[id]]/route.ts
import {NextResponse} from "next/server";
import {z, ZodError} from "zod";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {ApiError} from "@/lib/types/api";

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
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message}, {status: err.status});
        }
        if (err instanceof ZodError) {
            return NextResponse.json(
                {message: "Invalid [id]", errors: err.issues.map(i => ({field: i.path.join("."), message: i.message}))},
                {status: 400}
            );
        }
        console.error("Get deck error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
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
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message}, {status: err.status});
        }
        if (err instanceof ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid body or [id]",
                    errors: err.issues.map(i => ({field: i.path.join("."), message: i.message}))
                },
                {status: 400}
            );
        }
        console.error("Update deck error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
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
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message}, {status: err.status});
        }
        if (err instanceof ZodError) {
            return NextResponse.json(
                {message: "Invalid [id]", errors: err.issues.map(i => ({field: i.path.join("."), message: i.message}))},
                {status: 400}
            );
        }
        console.error("Delete deck error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
