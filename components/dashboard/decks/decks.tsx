"use client";
import {useDeckStats} from "@/hooks/useDecks";
import Deck from "@/components/dashboard/decks/deck";
import styles from "./decks.module.css"
import {PlusIcon} from "lucide-react";
import CreateDeckModal from "@/components/dashboard/decks/create-deck-modal";
import {useState} from "react";

export default function Decks() {
    const {data: decksRes, isLoading: decksLoading} = useDeckStats({take: 20, skip: 0});
    const [open, setOpen] = useState(false);
    if (decksLoading) return <div>Loading decks…</div>;
    return (
        <div>
            <div className={"flex justify-between w-full items-center mb-4"}>
                <h3 className={"text-2xl font-semibold"}>My decks</h3>
                <PlusIcon size={30} className={"cursor-pointer"} onClick={() => setOpen(true)}/>
            </div>
            <div className={styles.decksContainer}>
                {decksRes && decksRes.items.map((deck) => (
                    <Deck deck={deck} key={deck.id}/>
                ))}
            </div>
            <CreateDeckModal open={open} onOpenChange={setOpen}/>
        </div>
    );
}
