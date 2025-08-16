// lib/api/progression-helpers.ts
import {prisma} from "@/lib/prisma";
import type {Prisma, PrismaClient} from "@prisma/client";

// Allow passing a transaction client or the prisma client
type Tx = PrismaClient | Prisma.TransactionClient;

export function bucketFromInterval(intervalStrength: number | null | undefined) {
    const v = typeof intervalStrength === "number" ? intervalStrength : 0;
    if (v >= 0.75) return "high";
    if (v >= 0.5) return "mid";
    if (v >= 0.25) return "low";
    return "veryLow";
}

/** UTC day bounds. Swap to the TZ version below if you need Europe/Warsaw day buckets. */
export function utcDayBounds(d = new Date()) {
    const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
    const next = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1, 0, 0, 0, 0));
    return {start, next};
}

/** Europe/Warsaw day bounds (optional) */
// import { zonedTimeToUtc } from "date-fns-tz";
// const TIMEZONE = "Europe/Warsaw";
// export function warsawDayBounds(d = new Date()) {
//   const local = new Date(d.toLocaleString("en-US", { timeZone: TIMEZONE }));
//   const startLocal = new Date(local.getFullYear(), local.getMonth(), local.getDate(), 0, 0, 0, 0);
//   const nextLocal = new Date(local.getFullYear(), local.getMonth(), local.getDate() + 1, 0, 0, 0, 0);
//   return { start: zonedTimeToUtc(startLocal, TIMEZONE), next: zonedTimeToUtc(nextLocal, TIMEZONE) };
// }

/**
 * Increment today's UserProgressionHistory bucket for a user.
 * Call this inside a transaction if you're also creating a Card.
 */
export async function incrementDailyProgression(
    tx: Tx,
    userId: string,
    indication: "high" | "mid" | "low" | "veryLow",
    now = new Date()
) {
    const {start, next} = utcDayBounds(now); // or warsawDayBounds(now)

    const today = await tx.userProgressionHistory.findFirst({
        where: {userId, createdAt: {gte: start, lt: next}},
        orderBy: {id: "asc"},
    });

    const increments: any = {lastModifiedAt: now};
    if (indication === "high") increments.highIndicationCount = {increment: 1};
    if (indication === "mid") increments.midIndicationCount = {increment: 1};
    if (indication === "low") increments.lowIndicationCount = {increment: 1};
    if (indication === "veryLow") increments.veryLowIndicationCount = {increment: 1};

    if (today) {
        await tx.userProgressionHistory.update({
            where: {id: today.id},
            data: increments,
        });
    } else {
        await tx.userProgressionHistory.create({
            data: {
                userId,
                createdAt: now,
                lastModifiedAt: now,
                highIndicationCount: indication === "high" ? 1 : 0,
                midIndicationCount: indication === "mid" ? 1 : 0,
                lowIndicationCount: indication === "low" ? 1 : 0,
                veryLowIndicationCount: indication === "veryLow" ? 1 : 0,
            },
        });
    }
}
