// hooks/useCreateSession.ts
"use client";

import {useMutation} from "@tanstack/react-query";
import {sendJSON} from "@/lib/http"; // optional helper; below uses fetch directly

export type SessionCard = {
    cardId: number;
    deckId: number;
    deckName: string;
    question: string;
    answer: string;
    context?: string | null;
    mode: "normal" | "reversed" | "typing";
    intervalStrength: number | null;
    nextRepetitionTime: string | null;
    isDue: boolean;
};

export function useCreateSession() {
    return useMutation<{ session: SessionCard[]; sessionType: "due" | "generated" }, void>({
        mutationFn: async () => {
            const res = await fetch("/api/learn");
            if (!res.ok) throw new Error("Failed to generate session");
            return res.json();
        },
    });
}
