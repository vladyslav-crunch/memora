// app/layout.tsx
import type {Metadata} from "next";
import "./globals.css";
import {Montserrat} from "next/font/google";

const montserrat = Montserrat({subsets: ["latin"], weight: ["200", "300", "400", "500", "700"], display: "swap"});

export const metadata: Metadata = {
    title: "Memora – Flashcards App",
    description:
        "Memora helps you learn and retain new words faster with personalized decks, spaced repetition, and progress tracking. Study smarter, not harder.",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={montserrat.className}>
        <div className="pageShell">
            {children}
        </div>
        </body>
        </html>
    );
}
