export type Card = {
    id: number;
    front: string;
    back: string;
    context: string | null;
    intervalStrength: number | null;
    nextRepetitionTime: string | null;
    createdAt: string;
    deckId: number;
};
export type CardListResponse = {
    items: Card[];
    total: number;
    take: number;
    skip: number;
};