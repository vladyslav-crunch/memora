import {useQuery} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";

type CardsExistResponse = {
    exists: boolean;
};

export function useCardsExist(deckId?: number) {
    return useQuery<CardsExistResponse, Error>({
        queryKey: ["cardsExist", deckId],
        queryFn: async () => {
            let url = "/api/cards/exists";
            if (deckId) {
                url += `?deckId=${deckId}`;
            }
            return getJSON<CardsExistResponse>(url);
        },
        refetchInterval: 1000 * 60, // 1 min
    });
}
