import {useMutation, useQueryClient} from "@tanstack/react-query";
import {sendJSON} from "@/lib/http";


export function useImportCards() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: {
            deckId: number;
            cards: { front: string; back: string; context?: string | null }[];
        }) =>
            sendJSON<{ count: number; items: any[] }>("/api/cards/import", {
                method: "POST",
                body,
            }),

        onSuccess: (_, {deckId}) => {
            qc.invalidateQueries({queryKey: ["cards", {deckId}]});
            qc.invalidateQueries({queryKey: ["decks"]});
            qc.invalidateQueries({queryKey: ["deckStats"]});
            qc.invalidateQueries({queryKey: ["progressionHistory"]});
            qc.invalidateQueries({queryKey: ["dueCards"]});
            qc.invalidateQueries({queryKey: ["cardsExist"]});
        },
    });
}
