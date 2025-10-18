import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {UpdateUserSchema} from "@/lib/validation/user/update-user.schema";

export async function GET() {
    try {
        const userId = await requireUserId();

        const user = await prisma.user.findUnique({
            where: {id: userId},
        });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }

        const {passwordHash, ...safeUser} = user;

        const totalDecks = await prisma.deck.count({where: {userId}});
        const totalCards = await prisma.card.count({
            where: {deck: {userId}},
        });

        const stats = {
            totalDecks,
            totalCards,
        };

        const userWithStatus = {
            ...safeUser,
            hasPassword: !!passwordHash,
        };

        return NextResponse.json({user: userWithStatus, stats});
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
}

export async function PUT(req: Request) {
    try {
        const userId = await requireUserId();
        const body = await req.json();

        const parsed = UpdateUserSchema.safeParse(body);
        if (!parsed.success) {
            const errors = parsed.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return NextResponse.json({errors}, {status: 400});
        }

        const updatedUser = await prisma.user.update({
            where: {id: userId},
            data: parsed.data,
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {passwordHash, ...safeUser} = updatedUser;
        return NextResponse.json(safeUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}

export async function DELETE() {
    try {
        const userId = await requireUserId();
        await prisma.user.delete({where: {id: userId}});

        return NextResponse.json({message: "User account deleted successfully"});
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({error: "Internal server error"}, {status: 500});
    }
}
