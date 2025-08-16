// hooks/useCards.ts
"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getJSON, sendJSON} from "@/lib/http";
import type {Card, CardListResponse} from "@/lib/types/api";

const cardsKey = (deckId: number, params?: { take?: number; skip?: number }) =>
    ["cards", {deckId, take: params?.take ?? 20, skip: params?.skip ?? 0}] as const;

export function useCards(deckId: number | undefined, params?: { take?: number; skip?: number }) {
    const {take = 20, skip = 0} = params ?? {};
    return useQuery({
        queryKey: deckId ? cardsKey(deckId, {take, skip}) : ["cards", "disabled"],
        queryFn: () => getJSON<CardListResponse>(`/api/cards?deckId=${deckId}&take=${take}&skip=${skip}`),
        enabled: !!deckId,
    });
}

export function useCard(id: number | undefined) {
    return useQuery({
        queryKey: ["cards", "one", id],
        queryFn: () => getJSON<Card>(`/api/cards/${id}`),
        enabled: !!id,
    });
}

export function useCreateCard() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: {
            deckId: number;
            front: string;
            back: string;
            context?: string | null;
            intervalStrength?: number | null
        }) =>
            sendJSON<Card>("/api/cards", {method: "POST", body}),
        onSuccess: (card) => {
            // refetch card lists for this deck
            qc.invalidateQueries({queryKey: ["cards"]});
            // and decks lists (if you show counts/ordering)
            qc.invalidateQueries({queryKey: ["decks"]});
            // if you also have a progression graph hook, invalidate that key here
            qc.invalidateQueries({queryKey: ["progression", "today"]});
        },
    });
}

export function useUpdateCard(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: Partial<Card>) =>
            sendJSON<Card>(`/api/cards/${id}`, {method: "PUT", body}),
        onSuccess: (card) => {
            qc.invalidateQueries({queryKey: ["cards", "one", id]});
            qc.invalidateQueries({queryKey: ["cards", {deckId: card.deckId}]}); // broad
            qc.invalidateQueries({queryKey: ["cards"]}); // ensure pagination variants refetch
        },
    });
}

export function useDeleteCard(id: number, deckId?: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () =>
            sendJSON<{ success: true }>(`/api/cards/${id}`, {method: "DELETE"}),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["cards"]});
            if (deckId) qc.invalidateQueries({queryKey: ["cards", {deckId}]});
            qc.invalidateQueries({queryKey: ["decks"]});
        },
    });
}
