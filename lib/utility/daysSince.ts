export function daysSince(dateString: string): number {
    const createdAt = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
