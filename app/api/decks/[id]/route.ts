// app/api/card-list/[[id]]/route.ts
import {NextResponse} from "next/server";
import {ZodError} from "zod";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {ApiError} from "@/lib/types/api.types";
import {UpdateDeckSchema} from "@/lib/validation/deck/deck-update.schema";


export const runtime = "nodejs";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {id} = await context.params;

        const deckId = Number(id);
        if (isNaN(deckId)) {
            return NextResponse.json({message: "Invalid deck ID"}, {status: 400});
        }

        const deck = await prisma.deck.findFirst({where: {id: deckId, userId}});
        if (!deck) return NextResponse.json({error: "Not found"}, {status: 404});

        return NextResponse.json(deck);
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message}, {status: err.status});
        }
        if (err instanceof ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid parameters",
                    errors: err.issues.map((i) => ({field: i.path.join("."), message: i.message})),
                },
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
        const {id} = await context.params;

        const deckId = Number(id);
        if (isNaN(deckId)) {
            return NextResponse.json({message: "Invalid deck ID"}, {status: 400});
        }

        const json = await req.json();
        const parsed = UpdateDeckSchema.safeParse(json);

        if (!parsed.success) {
            return NextResponse.json(
                {
                    message: "Invalid deck data",
                    errors: parsed.error.issues.map((i) => ({field: i.path.join("."), message: i.message})),
                },
                {status: 400}
            );
        }

        const existing = await prisma.deck.findFirst({where: {id: deckId, userId}});
        if (!existing) return NextResponse.json({error: "Not found"}, {status: 404});

        const updated = await prisma.deck.update({where: {id: deckId}, data: parsed.data});
        return NextResponse.json(updated);
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message}, {status: err.status});
        }
        if (err instanceof ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid deck data",
                    errors: err.issues.map((i) => ({field: i.path.join("."), message: i.message})),
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
        const {id} = await context.params;

        const deckId = Number(id);
        if (isNaN(deckId)) {
            return NextResponse.json({message: "Invalid deck ID"}, {status: 400});
        }

        const existing = await prisma.deck.findFirst({where: {id: deckId, userId}});
        if (!existing) return NextResponse.json({error: "Not found"}, {status: 404});

        await prisma.deck.delete({where: {id: deckId}});
        return NextResponse.json({success: true});
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message}, {status: err.status});
        }
        if (err instanceof ZodError) {
            return NextResponse.json(
                {
                    message: "Invalid [id]",
                    errors: err.issues.map((i) => ({field: i.path.join("."), message: i.message})),
                },
                {status: 400}
            );
        }

        console.error("Delete deck error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
