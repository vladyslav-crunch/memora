import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";

export async function GET() {
    try {
        const userId = await requireUserId();

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
