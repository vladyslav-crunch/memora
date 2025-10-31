import {useMutation, useQueryClient} from "@tanstack/react-query";
import {sendJSON} from "@/lib/http";
import {toast} from "sonner";
import {ApiError} from "@/lib/types/api.types";

export function useCopyDeck() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (deckId: number) =>
            await sendJSON<{ newDeckId: number; copiedCount: number }>(
                `/api/decks/copy/${deckId}`,
                {method: "POST"}
            ),

        onSuccess: (data) => {
            toast.success(`Deck copied successfully! ${data.copiedCount} cards added.`);
            
            qc.invalidateQueries({queryKey: ["decks"]});
            qc.invalidateQueries({queryKey: ["deckStats"]});
            qc.invalidateQueries({queryKey: ["cards"]});
            qc.invalidateQueries({queryKey: ["dueCards"]});
        },

        onError: (err: ApiError) => {
            console.error(err);
            const message = err?.message || "Failed to copy the deck.";
            toast.error(message);
        },
    });
}
