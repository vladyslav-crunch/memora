// app/layout.tsx
import type {Metadata} from "next";
import "./globals.css";
import {Montserrat} from "next/font/google";
import Providers from "@/app/providers";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
    display: "swap"
});

export const metadata: Metadata = {
    title: "Memora – Flashcards App",
    description:
        "Memora helps you learn and retain new words faster with personalized decks, spaced repetition, and progress tracking. Study smarter, not harder.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className={montserrat.className}>
        <body>
        <Providers>
            <div className="pageShell">
                {children}
            </div>
        </Providers>
        </body>
        </html>
    );
}
