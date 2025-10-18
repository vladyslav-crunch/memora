// types/api.ts
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

export type ApiFieldError<TFields extends string = string> = {
    field: TFields;
    message: string;
};

export type ApiErrorResponse<TFields extends string = string> = {
    status: number;
    message?: string;
    errors?: ApiFieldError<TFields>[];
};

export class ApiError extends Error implements ApiErrorResponse {
    status: number;
    errors?: ApiFieldError[];

    constructor(status: number, message?: string, errors?: ApiFieldError[]) {
        super(message);
        this.status = status;
        this.errors = errors;
        Object.setPrototypeOf(this, ApiError.prototype); // important for instanceof
    }
}