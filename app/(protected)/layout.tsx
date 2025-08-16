import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import Header from "@/components/header/header";

export default async function ProtectedLayout({children}: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user) {
        redirect(`/sign-in`);
    }
    return (
        <>
            <Header/>
            {children}
        </>
    )
}