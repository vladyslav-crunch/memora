import type {Metadata} from "next";
import "./globals.css";
import {Montserrat} from "next/font/google";
import Providers from "@/app/providers";
import AppBackground from "@/components/ui/app-background/app-background";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
    display: "swap"
});

export const metadata: Metadata = {
    title: "Memora – Flashcards App",
    description:
        "Memora helps you practice and retain new words faster with personalized card-list, spaced repetition, and progress tracking. Study smarter, not harder.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className={montserrat.className} data-scroll-behavior="smooth">
        <body>
        <Providers>
            <div className="pageShell">
                {children}
                <AppBackground/>
            </div>
        </Providers>
        </body>
        </html>
    );
}
