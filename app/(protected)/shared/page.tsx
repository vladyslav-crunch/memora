"use client";
import React, {useEffect} from "react";
import {useInView} from "react-intersection-observer";
import {useInfinitePublicDecks} from "@/hooks/useInfinitePublicDecks";
import Spinner from "@/components/ui/spinner/spinner";
import SharedDeck from "@/components/dashboard/shared-decks/shared-deck";
import styles from "./shared-decks.module.css";
import {useSearchStore} from "@/stores/useSearchStore";

const LIMIT = 30;

export default function Page() {
    const search = useSearchStore((s) => s.debouncedValue);
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfinitePublicDecks(
        {sortBy: "createdAt", sortOrder: "desc", search},
        LIMIT
    );

    const {ref, inView} = useInView({threshold: 0.4});

    useEffect(() => {
        if (inView && hasNextPage) fetchNextPage();
    }, [inView, hasNextPage, fetchNextPage]);

    const decks = data?.pages.flatMap((page) => page.items) ?? [];

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <h3 className="text-2xl font-semibold mb-4">Shared decks</h3>
            </header>

            <div className={styles.scrollArea}>
                {isLoading ? (
                    <div className={styles.deckFallback}>
                        <div className={styles.spinnerWrapper}>
                            <Spinner size={60}/>
                        </div>
                    </div>
                ) : decks.length === 0 ? (
                    <div className={styles.deckFallback}>
                        <p>
                            No shared decks found
                        </p>
                    </div>
                ) : (
                    <>
                        <div className={styles.decksGrid}>
                            {decks.map((deck) => (
                                <SharedDeck key={deck.id} deck={deck}/>
                            ))}
                        </div>

                        {hasNextPage && (
                            <div ref={ref} className="flex justify-center py-8">
                                {isFetchingNextPage && <Spinner size={40}/>}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
