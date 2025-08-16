import Header from "@/components/header/header";
import styles from "./auth-layout.module.css";
import AuthCards from "@/components/ui/auth-cards/auth-cards";
import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";

export default async function AuthLayout({children}: { children: React.ReactNode }) {
    const session = await auth();
    if (session?.user) {
        redirect(`/`);
    }
    return (
        <div className={styles.authLayout}>
            <Header mode={"auth"}/>
            <main className={styles.authMain}>
                {children}
                <AuthCards/>
            </main>
        </div>
    );
}