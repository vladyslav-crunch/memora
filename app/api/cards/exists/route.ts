import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";

export const runtime = "nodejs";

export async function GET(req: Request) {
    try {
        const userId = await requireUserId();
        const {searchParams} = new URL(req.url);
        const deckId = searchParams.get("deckId");

        // Check if at least one card exists (optionally for a specific deck)
        const exists = await prisma.card.findFirst({
            where: {
                deck: {
                    userId, // check ownership via deck
                },
                ...(deckId ? {deckId: Number(deckId)} : {}),
            },
            select: {id: true},
        });

        return NextResponse.json({exists: !!exists});
    } catch (err: any) {
        if (err?.status)
            return NextResponse.json({error: err.message}, {status: err.status});
        console.error("Card EXISTS error:", err);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}
