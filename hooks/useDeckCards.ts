import {useCards} from "@/hooks/useCards";
import {usePublicCards} from "@/hooks/usePublicCards";

export function useDeckCards(deckId: number, isPublic: boolean) {
    const privateQuery = useCards(deckId);
    const publicQuery = usePublicCards(deckId);
    return isPublic ? publicQuery : privateQuery;
}
