import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";


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

export async function POST(req: NextRequest) {
    try {
        const userId = await requireUserId();
        const decks = await prisma.deck.findMany({
            where: {userId},
            include: {cards: true},
        });

        const now = new Date();
        let session: any[] = [];

        for (const deck of decks) {
            // find cards that are due
            const dueCards = deck.cards.filter(
                (c) => !c.nextRepetitionTime || c.nextRepetitionTime <= now
            );

            // figure out which modes are enabled for this deck
            const availableModes: Mode[] = [];
            if (deck.isQuizNormal) availableModes.push("normal");
            if (deck.isQuizReversed) availableModes.push("reversed");
            if (deck.isQuizTyping) availableModes.push("typing");

            // skip if deck has no enabled modes
            if (availableModes.length === 0) continue;

            // build card entries
            let deckSession = dueCards.map((card) => {
                const mode = pickRandom(availableModes);

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
                        question = card.front;
                        answer = card.back;
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
                };
            });

            // shuffle inside deck if randomized flag is on
            if (deck.isQuizRandomized) {
                deckSession = shuffle(deckSession);
            }

            session.push(...deckSession);
        }

        // final global shuffle across decks
        session = shuffle(session);

        return NextResponse.json({session});
    } catch (error: any) {
        console.error(error);
        if (error.status === 401) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}
