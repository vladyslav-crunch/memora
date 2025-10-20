// hooks/usePublicDecksQuery.ts
import {useQuery} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";
import {PublicDecksParams, PublicDecksResponse} from "@/lib/types/shared-deck.types";

export interface PaginatedDecksParams extends PublicDecksParams {
    page?: number;
    limit?: number;
}

export function usePublicDecksQuery(params?: PaginatedDecksParams) {
    const {page, limit, ...rest} = params || {};
    
    const take = rest.take ?? limit ?? 12;
    const skip = rest.skip ?? (page ? (page - 1) * take : 0);

    const queryString = new URLSearchParams(
        Object.entries({
            ...rest,
            take: String(take),
            skip: String(skip),
        })
    ).toString();

    return useQuery<PublicDecksResponse>({
        queryKey: ["publicDecks", page, limit, rest],
        queryFn: () =>
            getJSON<PublicDecksResponse>(`/api/decks/public?${queryString}`),
        staleTime: 1000 * 60,
    });
}
