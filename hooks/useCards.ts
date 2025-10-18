"use client";

import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {getJSON, sendJSON} from "@/lib/http";
import {Card, CardListResponse} from "@/lib/types/card.types";

const cardsKey = (
    deckId: number,
    params?: { take?: number; skip?: number; search?: string }
) =>
    ["cards", {deckId, ...(params ?? {})}] as const;

export function useCards(
    deckId: number | undefined,
    params?: {
        take?: number;
        skip?: number;
        search?: string;
        sortBy?: "intervalStrength" | "nextRepetitionTime" | "createdAt";
        sortOrder?: "asc" | "desc";
    }
) {
    const searchParams = new URLSearchParams();
    if (params?.take !== undefined) searchParams.set("take", String(params.take));
    if (params?.skip !== undefined) searchParams.set("skip", String(params.skip));
    if (params?.search) searchParams.set("search", params.search);
    if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
    if (params?.sortOrder) searchParams.set("sortOrder", params.sortOrder);

    const queryString = searchParams.toString();
    const url = deckId
        ? `/api/cards?deckId=${deckId}${queryString ? `&${queryString}` : ""}`
        : "";

    return useQuery({
        queryKey: deckId ? cardsKey(deckId, params) : ["cards", "disabled"],
        queryFn: () => getJSON<CardListResponse>(url),
        enabled: !!deckId,
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
            qc.invalidateQueries({queryKey: ["progressionHistory"]});
            qc.invalidateQueries({queryKey: ["dueCards"]});
            qc.invalidateQueries({queryKey: ["cardsExist"]});
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


export function useMoveCards() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: { cardIds: number[]; newDeckId: number }) =>
            sendJSON<{ success: true; movedCount: number }>("/api/cards/move", {
                method: "PUT",
                body,
            }),
        onSuccess: (_data, variables) => {
            // invalidate all affected queries
            qc.invalidateQueries({queryKey: ["cards"]}); // all cards
            qc.invalidateQueries({queryKey: ["cards", {deckId: variables.newDeckId}]}); // target deck
            qc.invalidateQueries({queryKey: ["decks"]});
            qc.invalidateQueries({queryKey: ["cardsExist"]});
        },
    });
}

export function useDeleteCards(deckId?: number) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (body: { deckId: number; cardIds: number[] }) =>
            sendJSON<{ deletedCount: number }>("/api/cards", {
                method: "DELETE",
                body,
            }),
        onSuccess: (_data, variables) => {
            qc.invalidateQueries({queryKey: ["cards"]});
            if (deckId ?? variables.deckId) {
                qc.invalidateQueries({queryKey: ["cards", {deckId: variables.deckId}]});
            }
            qc.invalidateQueries({queryKey: ["decks"]});
            qc.invalidateQueries({queryKey: ["cardsExist"]});
            qc.invalidateQueries({queryKey: ["dueCards"]});
        },
    });
}
