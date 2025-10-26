export type PublicCard = {
    id: number;
    front: string;
    back: string;
    context: string | null;
};
export type PublicCardListResponse = {
    items: PublicCard[];
    total: number;
    take: number;
    skip: number;
};