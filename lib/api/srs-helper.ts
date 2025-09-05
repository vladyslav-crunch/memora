// lib/api/srs-helpers.ts
export function calculateNextRepetition(
    intervalStrength: number | null,
    isCorrect: boolean,
    now: Date
): { newStrength: number, nextTime: Date } {
    let strength = intervalStrength ?? 0;

    if (isCorrect) {
        strength = Math.min(strength + 0.15, 1);
    } else {
        strength = Math.max(strength - 0.3, 0);
    }

    const minInterval = 5 * 60 * 1000;               // 5 min
    const maxInterval = 180 * 24 * 60 * 60 * 1000;   // 6 mon
    const factor = Math.pow(maxInterval / minInterval, strength);
    const interval = minInterval * factor;

    const nextTime = new Date(now.getTime() + interval);

    return {newStrength: strength, nextTime};
}
