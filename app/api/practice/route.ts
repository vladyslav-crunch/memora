// app/api/practice/route.ts
import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {SessionCard} from "@/hooks/useSession";

type Mode = "normal" | "reversed" | "typing";

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
    return arr
        .map((value) => ({value, sort: Math.random()}))
        .sort((a, b) => a.sort - b.sort)
        .map(({value}) => value);
}

export async function GET(req: Request) {
    try {
        const userId = await requireUserId();

        const url = new URL(req.url);
        const deckIdParam = url.searchParams.get("deckId");
        const onlyDeckId = deckIdParam ? Number(deckIdParam) : undefined;

        const decks = await prisma.deck.findMany({
            where: onlyDeckId ? {userId, id: onlyDeckId} : {userId},
            include: {cards: true},
        });

        const now = new Date();
        const dueItems: SessionCard[] = [];
        const generatedItems: SessionCard[] = [];

        for (const deck of decks) {
            // collect enabled modes
            const enabledModes: Mode[] = [];
            if (deck.isQuizNormal) enabledModes.push("normal");
            if (deck.isQuizReversed) enabledModes.push("reversed");
            if (deck.isQuizTyping) enabledModes.push("typing");
            if (enabledModes.length === 0) continue;

            for (const card of deck.cards) {
                const isDue = !card.nextRepetitionTime || new Date(card.nextRepetitionTime) <= now;

                // pick one mode per card among enabledModes
                const mode = pickRandom(enabledModes);

                const buildItem = (dueFlag: boolean) => {
                    let question: string;
                    let answer: string;

                    switch (mode) {
                        case "normal":
                            question = card.front;
                            answer = card.back;
                            break;
                        case "reversed":
                            question = card.back;
                            answer = card.front;
                            break;
                        case "typing":
                            question = card.back;
                            answer = card.front;
                            break;
                    }

                    return {
                        deckId: deck.id,
                        deckName: deck.name,
                        cardId: card.id,
                        question,
                        answer,
                        context: card.context,
                        mode,
                        intervalStrength: card.intervalStrength,
                        nextRepetitionTime: card.nextRepetitionTime
                            ? new Date(card.nextRepetitionTime).toISOString()
                            : null,
                        isDue: dueFlag,
                    };
                };

                if (isDue) dueItems.push(buildItem(true));
                generatedItems.push(buildItem(false));
            }

            if (deck.isQuizRandomized) {
                dueItems.push(...shuffle(dueItems.splice(-deck.cards.length)));
                generatedItems.push(...shuffle(generatedItems.splice(-deck.cards.length)));
            }
        }

        let session: SessionCard[]
        let sessionType: "due" | "generated"

        if (dueItems.length > 0) {
            session = shuffle(dueItems);
            sessionType = "due";
        } else {
            session = shuffle(generatedItems);
            sessionType = "generated";
        }

        return NextResponse.json({session, sessionType});
    } catch (err: any) {
        console.error("practice GET error:", err);
        if (err?.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}
