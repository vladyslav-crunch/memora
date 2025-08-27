// lib/api/progression-helpers.ts
import {Prisma, PrismaClient} from "@prisma/client";

type Tx = PrismaClient | Prisma.TransactionClient;

export function bucketFromInterval(intervalStrength: number | null | undefined) {
    const v = typeof intervalStrength === "number" ? intervalStrength : 0;
    if (v >= 0.75) return "high";
    if (v >= 0.5) return "mid";
    if (v >= 0.25) return "low";
    return "veryLow";
}

/** UTC day bounds (start inclusive, next exclusive). */
export function utcDayBounds(d = new Date()) {
    const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
    const next = new Date(start);
    next.setUTCDate(start.getUTCDate() + 1);
    return {start, next};
}

/**
 * Upsert the single persistent UserProgressionEntry for (userId, cardId).
 * Assumes you have a composite unique @@unique([userId, cardId]) in Prisma schema.
 */
export async function upsertUserProgressionEntry(tx: Tx, userId: string, cardId: number, bucket: string, now = new Date()) {
    return tx.userProgressionEntry.upsert({
        where: {userId_cardId: {userId, cardId} as any},
        create: {userId, cardId, bucket, lastSeenAt: now} as any,
        update: {bucket, lastSeenAt: now} as any,
    });
}

/**
 * Recalculate today's UserProgressionHistory from UserProgressionEntry rows.
 * Creates today's row if missing, or updates it to match current counts.
 */
export async function recalcUserProgressionHistoryForToday(tx: Tx, userId: string, now = new Date()) {
    const {start} = utcDayBounds(now);

    // Count buckets from entries (preferred)
    const group = await tx.userProgressionEntry.groupBy({
        by: ["bucket"],
        where: {userId},
        _count: {bucket: true},
    });

    const counts: Record<string, number> = {high: 0, mid: 0, low: 0, veryLow: 0};
    for (const g of group as any) counts[g.bucket] = Number(g._count.bucket);

    // Fallback to cards if no entries
    if (group.length === 0) {
        counts.veryLow = await tx.card.count({
            where: {deck: {userId}, OR: [{intervalStrength: null}, {intervalStrength: {lt: 0.25}}]},
        });
        counts.low = await tx.card.count({where: {deck: {userId}, intervalStrength: {gte: 0.25, lt: 0.5}}});
        counts.mid = await tx.card.count({where: {deck: {userId}, intervalStrength: {gte: 0.5, lt: 0.75}}});
        counts.high = await tx.card.count({where: {deck: {userId}, intervalStrength: {gte: 0.75}}});
    }

    // Upsert today's history
    await tx.userProgressionHistory.upsert({
        where: {userId_createdAt: {userId, createdAt: start} as any}, // needs @@unique([userId, createdAt])
        update: {
            lastModifiedAt: now,
            highIndicationCount: counts.high,
            midIndicationCount: counts.mid,
            lowIndicationCount: counts.low,
            veryLowIndicationCount: counts.veryLow,
        },
        create: {
            userId,
            createdAt: start,
            lastModifiedAt: now,
            highIndicationCount: counts.high,
            midIndicationCount: counts.mid,
            lowIndicationCount: counts.low,
            veryLowIndicationCount: counts.veryLow,
        },
    });
}

