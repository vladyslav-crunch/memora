// lib/api/srs-helpers.ts
export function calculateNextRepetition(
    intervalStrength: number | null,
    isCorrect: boolean,
    now: Date
): { newStrength: number, nextTime: Date } {
    let strength = intervalStrength ?? 0;

    if (isCorrect) {
        strength = Math.min(strength + 0.25, 1); // grow toward 1
    } else {
        strength = Math.max(strength - 0.25, 0); // shrink toward 0
    }

    // Example mapping of strength → interval (tweak as you like)
    const intervals = [
        5 * 60 * 1000,       // 0.0 → 5 min
        30 * 60 * 1000,      // 0.25 → 30 min
        12 * 60 * 60 * 1000, // 0.5 → 12 hours
        24 * 60 * 60 * 1000, // 0.75 → 1 day
        3 * 24 * 60 * 60 * 1000, // 1.0 → 3 days
    ];

    const index = Math.round(strength * 4); // 0–4
    const offset = intervals[index];
    const nextTime = new Date(now.getTime() + offset);

    return {newStrength: strength, nextTime};
}
