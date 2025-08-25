// hooks/useCreateSession.ts
"use client";

import {useMutation} from "@tanstack/react-query";
import {sendJSON} from "@/lib/http";

export type SessionCard = {
    cardId: number;
    deckId: number;
    deckName: string;
    question: string;
    answer: string;
    context?: string | null;
    mode: "normal" | "reversed" | "typing";
};

export function useCreateSession() {
    return useMutation<SessionCard[], void>({
        mutationFn: async () => {
            const data = await sendJSON<{ session: SessionCard[] }>("/api/learn", {
                method: "POST",
            });
            return data.session;
        },
    });
}
