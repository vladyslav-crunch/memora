import {NextResponse} from "next/server";
import bcrypt from "bcrypt";
import {prisma} from "@/lib/prisma";
import {requireUserId} from "@/lib/api/auth-helper";
import {ChangePasswordServerSchema} from "@/lib/validation/user/change-password.schema";
import {ZodError} from "zod";

export async function PATCH(req: Request) {
    try {
        const userId = await requireUserId();
        const body = await req.json();

        const parseResult = ChangePasswordServerSchema.safeParse(body);
        if (!parseResult.success) {
            const errors = parseResult.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return NextResponse.json({errors}, {status: 400});
        }

        const {currentPassword, newPassword} = parseResult.data;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {id: true, passwordHash: true},
        });

        if (!user) {
            return NextResponse.json(
                {errors: [{field: "user", message: "User not found"}]},
                {status: 404}
            );
        }

        if (user.passwordHash) {
            const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
            if (!isMatch) {
                console.log("Not match");
                return NextResponse.json(
                    {
                        errors: [
                            {
                                field: "currentPassword",
                                message: "Current password is incorrect",
                            },
                        ],
                    },
                    {status: 400}
                );
            }
        }

        const newHash = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: {id: userId},
            data: {passwordHash: newHash},
        });

        return NextResponse.json({
            ok: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        console.error("Password change error:", err);

        if (err instanceof ZodError) {
            const errors = err.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            }));
            return NextResponse.json({errors}, {status: 400});
        }

        if (err instanceof Error) {
            return NextResponse.json(
                {errors: [{field: "server", message: err.message}]},
                {status: 500}
            );
        }

        return NextResponse.json(
            {errors: [{field: "unknown", message: "Unknown server error"}]},
            {status: 500}
        );
    }
}
