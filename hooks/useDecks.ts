"use client";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getJSON, sendJSON} from "@/lib/http";
import {Deck, DeckListResponse, DeckStatsResponse} from "@/lib/types/api";


const decksKey = (params?: { take?: number; skip?: number }) =>
    ["decks", {take: params?.take ?? 20, skip: params?.skip ?? 0}] as const;

export function useDecks(params?: { take?: number; skip?: number }) {
    const {take = 20, skip = 0} = params ?? {};
    return useQuery({
        queryKey: decksKey({take, skip}),
        queryFn: () => getJSON<DeckListResponse>(`/api/decks?take=${take}&skip=${skip}`),
    });
}

export function useDeck(id: number | undefined) {
    return useQuery({
        queryKey: ["decks", "one", id],
        queryFn: () => getJSON<Deck>(`/api/decks/${id}`),
        enabled: !!id,
    });
}

export function useCreateDeck() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: Partial<Deck> & { name: string }) =>
            sendJSON<Deck>("/api/decks", {method: "POST", body}),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["decks"]});
            qc.invalidateQueries({queryKey: ["deckStats"]});
        },
    });
}

export function useUpdateDeck(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: Partial<Deck>) =>
            sendJSON<Deck>(`/api/decks/${id}`, {method: "PATCH", body}),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["decks"]});
            qc.invalidateQueries({queryKey: ["decks", "one", id]});
        },
    });
}

export function useDeleteDeck(id: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () =>
            sendJSON<{ success: true }>(`/api/decks/${id}`, {method: "DELETE"}),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["decks"]});
        },
    });
}

export const deckStatsKey = (params?: { take?: number; skip?: number }) =>
    ["deckStats", {take: params?.take ?? 20, skip: params?.skip ?? 0}] as const;

export function useDeckStats(params?: { take?: number; skip?: number }) {
    const {take = 20, skip = 0} = params ?? {};
    return useQuery({
        queryKey: deckStatsKey({take, skip}),
        queryFn: () => getJSON<DeckStatsResponse>(`/api/decks/stats?take=${take}&skip=${skip}`),
    });
}
