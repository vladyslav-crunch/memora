export type PublicDeck = {
    id: number;
    name: string;
    cardCount: number;
    createdAt: string;
    owner: {
        id: string;
        name: string;
        image: string | null;
    };
}

export type PublicDecksResponse = {
    items: PublicDeck[];
    total: number;
    take: number;
    skip: number;
}

export type PublicDecksParams = {
    take?: number;
    skip?: number;
    sortBy?: "createdAt" | "cardCount";
    sortOrder?: "asc" | "desc";
    search?: string;
}

export type PublicDeckResponse = {
    id: number;
    name: string;
    owner: {
        name: string;
        image: string | null;
    };
}