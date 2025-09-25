"use client";
import {useDeckStats} from "@/hooks/useDecks";
import Deck from "@/components/dashboard/decks/deck";
import styles from "./decks.module.css";
import {PlusIcon} from "lucide-react";
import {useState} from "react";
import Spinner from "@/components/ui/spinner/spinner";
import dynamic from "next/dynamic";
import Link from "next/link";
import {Deck as DeckType} from '@/lib/types/api'
import AddCardModal from "@/components/dashboard/cards/modals/add-card-modal";
import {useSearchStore} from "@/stores/useSearchStore";

const CreateDeckModal = dynamic(
    () => import("@/components/dashboard/decks/modals/create-deck-modal"),
    {ssr: false}
);

export default function Decks() {
    const search = useSearchStore((s) => s.debouncedValue);
    const {data: decksRes, isLoading: decksLoading} = useDeckStats({search});
    const [isCreateOpen, setCreateOpen] = useState(false);
    const [isAddCardOpen, setAddCardOpen] = useState(false);
    const [newDeck, setNewDeck] = useState<DeckType | null>(null);

    const itemsCount = decksRes?.items?.length ?? 0;

    return (
        <div className={styles.decksContainer}>
            <div className="flex justify-between w-full items-center mb-4">
                <h3 className="text-2xl font-semibold">My decks</h3>
                <PlusIcon size={30} className="cursor-pointer" onClick={() => setCreateOpen(true)}/>
            </div>

            <div className={"h-full "}>
                {decksLoading && (
                    <div className={styles.deckFallback}>
                        <div className={styles.spinnerWrapper}>
                            <Spinner size={60}/>
                        </div>
                    </div>
                )}
                {!decksLoading && itemsCount === 0 && (
                    <div className={styles.deckFallback}>
                        <div className={"text-center p-20"}>
                            <h4>You don&#39;t have any decks yet</h4>
                            <p>Get one from the community or create a new deck to get started.</p>
                            <div className="flex gap-4 justify-center mt-6">
                                <Link
                                    href="/community/decks"
                                    className={styles.browseCommunityBtn}
                                >
                                    Browse Community
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setCreateOpen(true)}
                                    className={styles.createDeckBtn}
                                >
                                    Create Deck
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {!decksLoading && itemsCount > 0 && (
                    <div className={styles.decksGrid}>
                        {decksRes!.items.map((deck) => (
                            <Deck deck={deck} key={deck.id}/>
                        ))}
                    </div>
                )}
            </div>
            <CreateDeckModal open={isCreateOpen} onOpenChange={setCreateOpen} onCreated={(deck) => {
                setNewDeck(deck);
                setAddCardOpen(true); // open AddCardModal right after
            }}/>
            {newDeck && (
                <AddCardModal
                    open={isAddCardOpen}
                    onOpenChange={setAddCardOpen}
                    deck={newDeck}
                />
            )}
        </div>
    );
}
