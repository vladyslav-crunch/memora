import {useInfiniteQuery} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";
import {PublicDecksParams, PublicDecksResponse} from "@/lib/types/shared-deck.types";

export function useInfinitePublicDecks(params?: PublicDecksParams, limit = 20) {
    return useInfiniteQuery<PublicDecksResponse, Error>({
        queryKey: ["publicDecks", params, limit],
        initialPageParam: 0,
        

        queryFn: async ({pageParam}) => {
            const take = limit;
            const skip = Number(pageParam) * limit;

            const queryString = new URLSearchParams(
                Object.entries({
                    ...params,
                    take: String(take),
                    skip: String(skip),
                })
            ).toString();

            return getJSON<PublicDecksResponse>(`/api/decks/public?${queryString}`);
        },

        getNextPageParam: (lastPage, allPages) => {
            const totalLoaded = allPages.reduce(
                (sum, page) => sum + (page.items?.length ?? 0),
                0
            );
            return totalLoaded < (lastPage.total ?? 0) ? allPages.length : undefined;
        },

        staleTime: 1000 * 60,
    });
}
