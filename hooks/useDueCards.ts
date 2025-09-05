import {useQuery} from "@tanstack/react-query";

type DueCardsResponse = {
    hasDue: boolean;
    count: number;
};

export function useDueCards(deckId?: number) {
    return useQuery<DueCardsResponse, Error>({
        queryKey: ["dueCards", deckId],
        queryFn: async () => {
            const url = new URL("/api/practice/due", window.location.origin);
            if (deckId) url.searchParams.append("deckId", deckId.toString());

            const res = await fetch(url.toString());
            if (!res.ok) throw new Error("Failed to fetch due cards");

            return res.json();
        },
        refetchInterval: 1000 * 60,
    });
}