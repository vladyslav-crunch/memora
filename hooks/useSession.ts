// hooks/useCreateSession.ts
"use client";
import {useMutation} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";

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
    isRepeated: boolean;
};

type SessionResponse = {
    session: SessionCard[];
    sessionType: "due" | "generated";
};

export function useCreateSession(deckId?: number) {
    return useMutation<SessionResponse, unknown>({
        mutationFn: () => getJSON(`/api/practice${deckId ? `?deckId=${deckId}` : ""}`),
    });
}
