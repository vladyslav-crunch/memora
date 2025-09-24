export function formatNextRepetitionDashboard(nextRepetition: string | null, dueCards: number): string {
    if (dueCards > 0) {
        return "Ready to review";
    }
    if (!nextRepetition) {
        return "No reviews scheduled";
    }

    const now = new Date();
    const target = new Date(nextRepetition);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return "Ready to review";

    const totalMinutes = Math.floor(diff / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    if (days > 0 && hours > 0) return `Review in ${days}d ${hours}h`;
    if (days > 0) return `Review in ${days}d`;
    if (hours > 0) return `Review in ${hours}h`;
    return `Review in ${minutes}m`;
}

export function formatNextRepetitionTimeCardList(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
