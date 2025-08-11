import Header from "@/components/header/header";
import styles from "./auth-layout.module.css";
import AuthCards from "@/components/ui/auth-cards/auth-cards";

export default function AuthLayout({children}: { children: React.ReactNode }) {
    return (
        <div className={styles.authLayout}>
            <Header/>
            <main className={styles.authMain}>
                {children}
                <AuthCards/>
            </main>
        </div>
    );
}