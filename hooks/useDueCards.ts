import {useQuery} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";

type DueCardsResponse = {
    hasDue: boolean;
    count: number;
};

export function useDueCards(deckId?: number) {
    return useQuery<DueCardsResponse, Error>({
        queryKey: ["dueCards", deckId],
        queryFn: async () => {
            let url = "/api/practice/due";
            if (deckId) {
                url += `?deckId=${deckId}`;
            }
            return getJSON<DueCardsResponse>(url);
        },
        refetchInterval: 1000 * 60, // 1 min
    });
}
