import {useQuery} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";
import {PublicDecksParams, PublicDecksResponse} from "@/lib/types/shared-deck.types";


export function usePublicDecksQuery(params?: PublicDecksParams) {
    const queryString = new URLSearchParams(
        Object.entries(params || {}).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) acc[key] = String(value);
            return acc;
        }, {} as Record<string, string>)
    ).toString();

    return useQuery<PublicDecksResponse>({
        queryKey: ["publicDecks", params],
        queryFn: () => getJSON<PublicDecksResponse>(`/api/decks/public${queryString ? `?${queryString}` : ""}`),
        staleTime: 1000 * 60,
    });
}
