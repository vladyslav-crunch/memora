import React from 'react';
import {usePublicDecksQuery} from "@/hooks/usePublicDecksQuery";
import styles from "./shared-decks.module.css";
import SharedDeck from "@/components/dashboard/shared-decks/shared-deck";
import {ArrowRight} from "lucide-react";
import Spinner from "@/components/ui/spinner/spinner";

function SharedDecks() {
    const {data: latestDecks, isLoading} = usePublicDecksQuery({
        take: 3,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    console.log(latestDecks);
    const itemsCount = latestDecks?.items?.length ?? 0;

    return (
        <div>
            <div>
                <h3 className={"text-2xl font-semibold mb-4"}>Last shared decks</h3>
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
                        {latestDecks!.items.map((deck) => (
                            <SharedDeck deck={deck} key={deck.id}/>
                        ))}
                    </div>
                    <h2 className={"text-xl mt-3 flex items-center gap-1 cursor-pointer "}>
                        See more
                        <ArrowRight size={21} strokeWidth={1.3}/>
                    </h2>
                </div>
            )}


        </div>
    );
}

export default SharedDecks;