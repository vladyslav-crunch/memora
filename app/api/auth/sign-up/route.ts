import {NextResponse} from "next/server";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcrypt";
import {SignUpSchema} from "@/lib/validation/auth/auth-schemas";

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = SignUpSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json({error: "Invalid input"}, {status: 400});
        }
        const {email, name, password} = parsed.data;

        const exists = await prisma.user.findUnique({where: {email}});
        if (exists?.passwordHash) {
            return NextResponse.json({error: "Email already registered"}, {status: 409});
        }

        if (exists && !exists.passwordHash) {
            const passwordHash = await bcrypt.hash(password, 12);
            await prisma.user.update({
                where: {id: exists.id},
                data: {name: name || exists.name, passwordHash},
            });
            return NextResponse.json({ok: true, upgraded: true});
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {email, name, passwordHash},
            select: {id: true, email: true},
        });

        return NextResponse.json({ok: true, user});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: "Server error"}, {status: 500});
    }
}
