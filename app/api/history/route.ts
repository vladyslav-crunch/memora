import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {recalcUserProgressionHistoryForToday} from "@/lib/api/progression-helpers";

export async function GET() {
    try {
        const userId = await requireUserId();
        await recalcUserProgressionHistoryForToday(prisma, userId);
        const history = await prisma.userProgressionHistory.findMany({
            where: {userId},
            orderBy: {createdAt: "asc"},
            select: {
                createdAt: true,
                highIndicationCount: true,
                midIndicationCount: true,
                lowIndicationCount: true,
                veryLowIndicationCount: true,
            },
        });

        return NextResponse.json(history);
    } catch (err: any) {
        console.error("Progression history error:", err);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}
