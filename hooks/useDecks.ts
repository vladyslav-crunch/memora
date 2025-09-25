"use client";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getJSON, sendJSON} from "@/lib/http";
import {Deck, DeckListResponse, DeckStatsResponse} from "@/lib/types/api";

const decksKey = (params?: { take?: number; skip?: number }) =>
    ["decks", params ?? {}] as const;

export function useDecks(params?: { take?: number; skip?: number }) {
    // Build query string only if values exist
    const search = new URLSearchParams();
    if (params?.take !== undefined) search.set("take", String(params.take));
    if (params?.skip !== undefined) search.set("skip", String(params.skip));

    const query = search.toString();
    const url = query ? `/api/decks?${query}` : "/api/decks";

    return useQuery({
        queryKey: decksKey(params),
        queryFn: () => getJSON<DeckListResponse>(url),
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
            qc.invalidateQueries({queryKey: ["deckStats"]});
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
            qc.invalidateQueries({queryKey: ["deckStats"]});
            qc.invalidateQueries({queryKey: ["progressionHistory"]});
            qc.invalidateQueries({queryKey: ["cardsExist"]});
            qc.invalidateQueries({queryKey: ["cards"]});
        },
    });
}

export const deckStatsKey = (params?: { take?: number; skip?: number; search?: string }) =>
    ["deckStats", params ?? {}] as const;

export function useDeckStats(params?: { take?: number; skip?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.take !== undefined) searchParams.set("take", String(params.take));
    if (params?.skip !== undefined) searchParams.set("skip", String(params.skip));
    if (params?.search) searchParams.set("search", params.search.trim()); // trim spaces

    const queryString = searchParams.toString();
    const url = queryString ? `/api/decks/stats?${queryString}` : `/api/decks/stats`;

    return useQuery({
        queryKey: deckStatsKey(params), // includes search
        queryFn: () => getJSON<DeckStatsResponse>(url),
        refetchInterval: 1000 * 60,
    });
}
