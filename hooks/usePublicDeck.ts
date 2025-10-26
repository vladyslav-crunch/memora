import {useQuery} from "@tanstack/react-query";
import {getJSON} from "@/lib/http";
import {PublicDeckResponse} from "@/lib/types/shared-deck.types";

export function usePublicDeck(id: number) {
    return useQuery<PublicDeckResponse, Error>({
        queryKey: ["deck", id],
        queryFn: async () => {
            if (!id) throw new Error("Deck ID is required");
            try {
                return await getJSON<PublicDeckResponse>(`/api/decks/public/${id}`);
            } catch (err) {
                console.log("Failed to fetch public deck:", err);
                throw err;
            }
        },
    });
}