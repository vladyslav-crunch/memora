export function fillLastWeek<T extends { createdAt: string }>(
    records: (T & {
        highIndicationCount: number;
        midIndicationCount: number;
        lowIndicationCount: number;
        veryLowIndicationCount: number;
    })[]
) {
    const sorted = [...records].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const result: typeof sorted = [];
    const end = new Date(); // today
    const start = new Date();
    start.setDate(end.getDate() - 6); // 7 days total

    let prev = sorted[0] ?? {
        highIndicationCount: 0,
        midIndicationCount: 0,
        lowIndicationCount: 0,
        veryLowIndicationCount: 0,
        createdAt: start.toISOString(),
    };

    const current = new Date(start);

    while (current <= end) {
        const isoDate = current.toISOString().split("T")[0];
        const match = sorted.find((r) => r.createdAt.split("T")[0] === isoDate);

        if (match) {
            prev = match;
            result.push(match);
        } else {
            result.push({...prev, createdAt: new Date(current).toISOString()});
        }

        current.setDate(current.getDate() + 1);
    }

    return result;
}
