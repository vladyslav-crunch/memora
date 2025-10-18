export type UserProfile = {
    id: string;
    name: string;
    email: string;
    image?: string;
    createdAt: string;
    hasPassword: boolean;
};

export type UserStats = {
    totalDecks: number;
    totalCards: number;
};

export type UserMeResponse = {
    user: UserProfile;
    stats: UserStats;
};