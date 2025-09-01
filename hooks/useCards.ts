"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getJSON, sendJSON} from "@/lib/http";
import type {Card, CardListResponse} from "@/lib/types/api";

const cardsKey = (deckId: number, params?: { take?: number; skip?: number }) =>
    ["cards", {deckId, ...(params ?? {})}] as const;

export function useCards(deckId: number | undefined, params?: { take?: number; skip?: number }) {
    const search = new URLSearchParams();
    if (params?.take !== undefined) search.set("take", String(params.take));
    if (params?.skip !== undefined) search.set("skip", String(params.skip));

    const query = search.toString();
    const url = deckId ? `/api/cards?deckId=${deckId}${query ? `&${query}` : ""}` : "";

    return useQuery({
        queryKey: deckId ? cardsKey(deckId, params) : ["cards", "disabled"],
        queryFn: () => getJSON<CardListResponse>(url),
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
            intervalStrength?: number | null;
        }) =>
            sendJSON<Card>("/api/cards", {method: "POST", body}),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["cards"]});
            qc.invalidateQueries({queryKey: ["decks"]});
            qc.invalidateQueries({queryKey: ["deckStats"]});
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
