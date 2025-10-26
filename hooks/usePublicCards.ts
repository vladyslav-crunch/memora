"use client";
import {useQuery} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";
import {PublicCardListResponse} from "@/lib/types/shared-cards.types";


const publicCardsKey = (
    deckId: number,
    params?: {
        take?: number;
        skip?: number;
        search?: string;
        sortBy?: "createdAt";
        sortOrder?: "asc" | "desc";
    }
) => ["publicCards", {deckId, ...(params ?? {})}] as const;

export function usePublicCards(
    deckId: number | undefined,
    params?: {
        take?: number;
        skip?: number;
        search?: string;
        sortBy?: "createdAt";
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
        ? `/api/cards/public?deckId=${deckId}${queryString ? `&${queryString}` : ""}`
        : "";

    return useQuery({
        queryKey: deckId ? publicCardsKey(deckId, params) : ["publicCards", "disabled"],
        queryFn: () => getJSON<PublicCardListResponse>(url),
        enabled: !!deckId,
    });
}
