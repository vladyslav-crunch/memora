import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {ApiError} from "@/lib/types/api.types";

export const runtime = "nodejs";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await context.params;
        if (!id) {
            return NextResponse.json({message: "Deck ID is required"}, {status: 400});
        }

        const deck = await prisma.deck.findUnique({
            where: {id: Number(id)},
            select: {
                id: true,
                name: true,
                user: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        if (!deck) {
            return NextResponse.json({message: "Deck not found"}, {status: 404});
        }

        return NextResponse.json({
            id: deck.id,
            name: deck.name,
            owner: {
                name: deck.user.name,
                image: deck.user.image,
            },
        });
    } catch (err) {
        if (err instanceof ApiError) {
            return NextResponse.json({message: err.message, errors: err.errors}, {status: err.status});
        }

        console.error("Get deck error:", err);
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
