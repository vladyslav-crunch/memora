// app/api/user/password/route.ts
import {NextResponse} from "next/server";
import bcrypt from "bcrypt";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";


export async function PATCH(req: Request) {
    try {
        const userId = await requireUserId(); // ensures user is logged in
        const {currentPassword, newPassword} = await req.json();

        if (!newPassword) {
            return NextResponse.json(
                {error: "New password is required"},
                {status: 400}
            );
        }

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {id: true, passwordHash: true},
        });

        if (!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        
        if (user.passwordHash) {
            if (!currentPassword) {
                return NextResponse.json(
                    {error: "Current password is required"},
                    {status: 400}
                );
            }

            const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isMatch) {
                return NextResponse.json(
                    {error: "Current password is incorrect"},
                    {status: 400}
                );
            }
        }

        // 🧩 CASE 2: Google user (no password yet) → just set one
        const newHash = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: {id: userId},
            data: {passwordHash: newHash},
        });

        return NextResponse.json({ok: true, message: "Password updated successfully"});
    } catch (err: any) {
        console.error("Password change error:", err);
        const status = err.status ?? 500;
        return NextResponse.json(
            {error: err.message || "Server error"},
            {status}
        );
    }
}
