// types/api.types.ts
export type Deck = {
    id: number;
    name: string;
    isQuizNormal: boolean;
    isQuizReversed: boolean;
    isQuizTyping: boolean;
    isQuizRandomized: boolean;
    isPrivate: boolean;
    createdAt: string;
    userId: string;
};
export type DeckListResponse = {
    items: Deck[];
    total: number;
    take: number;
    skip: number;
};
export type DeckStatsItem = {
    id: number;
    name: string;
    isQuizNormal: boolean;
    isQuizReversed: boolean;
    isQuizTyping: boolean;
    isQuizRandomized: boolean;
    isPrivate: boolean;
    createdAt: string;
    counts: {
        totalCards: number;
        dueCards: number;
    };
    userId: string;
    nextRepetition: string | null;
};
export type DeckStatsResponse = {
    items: DeckStatsItem[];
    total: number;
    take: number;
    skip: number;
};