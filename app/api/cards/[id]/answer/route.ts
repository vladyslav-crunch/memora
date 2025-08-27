// app/api/cards/[id]/answer/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {
    bucketFromInterval,
    upsertUserProgressionEntry,
    recalcUserProgressionHistoryForToday
} from "@/lib/api/progression-helpers";
import {calculateNextRepetition} from "@/lib/api/srs-helper";
import {z} from "zod";

const IdParam = z.object({id: z.string().regex(/^\d+$/)});

export const runtime = "nodejs";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const userId = await requireUserId();
        const {isCorrect} = await req.json();
        const {id} = IdParam.parse(await context.params);
        const cardId = Number(id);

        const card = await prisma.card.findUnique({where: {id: cardId}, include: {deck: true}});
        if (!card || card.deck.userId !== userId) {
            return NextResponse.json({error: "Not found or unauthorized"}, {status: 404});
        }

        const now = new Date();

        const {newStrength, nextTime} = calculateNextRepetition(card.intervalStrength, isCorrect, now);
        const newBucket = bucketFromInterval(newStrength);

        const updatedCard = await prisma.$transaction(async (tx) => {
            const c = await tx.card.update({
                where: {id: card.id},
                data: {intervalStrength: newStrength, nextRepetitionTime: nextTime},
            });

            await upsertUserProgressionEntry(tx, userId, cardId, newBucket, now);

            await recalcUserProgressionHistoryForToday(tx, userId, now);

            return c;
        });

        return NextResponse.json(updatedCard);
    } catch (err: any) {
        console.error("Card answer error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
