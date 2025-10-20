"use client";
import React, {useState, useEffect} from "react";
import {usePublicDecksQuery} from "@/hooks/usePublicDecksQuery";
import styles from "./shared-decks.module.css";
import Spinner from "@/components/ui/spinner/spinner";
import SharedDeck from "@/components/dashboard/shared-decks/shared-deck";

function Page() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    useEffect(() => {
        function calculateLimit() {
            const screenHeight = window.innerHeight;
            const cardHeight = 135;
            const rowsPerPage = Math.floor((screenHeight - 200) / cardHeight);
            const columns = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 4;
            const newLimit = Math.max(rowsPerPage * columns, 4);
            setLimit(newLimit);
        }

        calculateLimit();
        window.addEventListener("resize", calculateLimit);
        return () => window.removeEventListener("resize", calculateLimit);
    }, []);

    const {data: sharedDecks, isLoading, isFetching} = usePublicDecksQuery({
        sortBy: "createdAt",
        sortOrder: "desc",
        page,
        limit,
    });

    const itemsCount = sharedDecks?.items?.length ?? 0;
    const total = sharedDecks?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    return (
        <div>
            <div>
                <h3 className="text-2xl font-semibold mb-4">Shared decks</h3>
            </div>

            {(isLoading || isFetching) && (
                <div className={styles.deckFallback}>
                    <div className={styles.spinnerWrapper}>
                        <Spinner size={60}/>
                    </div>
                </div>
            )}

            {!isLoading && itemsCount > 0 && (
                <>
                    <div className={styles.decksGrid}>
                        {sharedDecks!.items.map((deck) => (
                            <SharedDeck deck={deck} key={deck.id}/>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-4 mt-10">
                        <button
                            className={styles.paginationButton}
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            Previous
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            className={styles.paginationButton}
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {!isLoading && itemsCount === 0 && (
                <p className="text-gray-500">No shared decks found.</p>
            )}
        </div>
    );
}

export default Page;
