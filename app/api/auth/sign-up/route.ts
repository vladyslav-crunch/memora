import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";

const SignUpSchema = z.object({
    email: z.email(),
    name: z.string().trim().min(1).max(60).optional().or(z.literal("")),
    password: z.string().min(6),
});

export async function POST(req: Request) {
    try {
        const json = await req.json();
        const parsed = SignUpSchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }
        const { email, name, password } = parsed.data;

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists?.passwordHash) {
            return NextResponse.json({ error: "Email already registered" }, { status: 409 });
        }

        // If the email exists but was Google-only (no passwordHash), let them set one
        if (exists && !exists.passwordHash) {
            const passwordHash = await bcrypt.hash(password, 12);
            await prisma.user.update({
                where: { id: exists.id },
                data: { name: name || exists.name, passwordHash },
            });
            return NextResponse.json({ ok: true, upgraded: true });
        }

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: { email, name: name || null, passwordHash },
            select: { id: true, email: true },
        });

        return NextResponse.json({ ok: true, user });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
