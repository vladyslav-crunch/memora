"use client";
import React from "react";
import {useRouter} from "next/navigation";
import styles from "./shared-decks.module.css";
import {ArrowRight} from "lucide-react";
import Spinner from "@/components/ui/spinner/spinner";
import SharedDeck from "@/components/dashboard/shared-decks/shared-deck";
import {useInfinitePublicDecks} from "@/hooks/useInfinitePublicDecks";

function LastSharedDecks() {
    const router = useRouter();
    const {
        data,
        isLoading,
    } = useInfinitePublicDecks(
        {
            sortBy: "createdAt",
            sortOrder: "desc",
        },
        3
    );
    
    const decks = data?.pages.flatMap((page) => page.items) ?? [];
    const itemsCount = decks.length;

    return (
        <div>
            <div>
                <h3 className="text-2xl font-semibold mb-4">Last shared decks</h3>
            </div>

            {isLoading && (
                <div className={styles.deckFallback}>
                    <div className={styles.spinnerWrapper}>
                        <Spinner size={60}/>
                    </div>
                </div>
            )}

            {!isLoading && itemsCount > 0 && (
                <div>
                    <div className={styles.decksGrid}>
                        {decks.slice(0, 3).map((deck) => (
                            <SharedDeck deck={deck} key={deck.id}/>
                        ))}
                    </div>

                    <h2
                        className="text-xl mt-3 flex items-center gap-1 cursor-pointer "
                        onClick={() => router.push("/shared")}
                    >
                        See more
                        <ArrowRight size={21} strokeWidth={1.3}/>
                    </h2>
                </div>
            )}

            {!isLoading && itemsCount === 0 && (
                <p className="text-gray-500">No shared decks found.</p>
            )}
        </div>
    );
}

export default LastSharedDecks;
