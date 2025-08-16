"use client";
import {useDeckStats} from "@/hooks/useDecks";
import Deck from "@/components/dashboard/decks/deck";
import styles from "./decks.module.css"
import {PlusIcon} from "lucide-react";

export default function Decks() {
    const {data: decksRes, isLoading: decksLoading} = useDeckStats({take: 20, skip: 0});


    if (decksLoading) return <div>Loading decks…</div>;
    console.log(decksRes);
    return (
        <div>
            <div className={"flex justify-between w-full items-center mb-4"}>
                <h3 className={"text-2xl font-semibold"}>My decks</h3>
                <PlusIcon size={30} className={"cursor-pointer"}/>
            </div>
            <div className={styles.decksContainer}>
                {decksRes && decksRes.items.map((deck) => (
                    <Deck deck={deck} key={deck.id}/>
                ))}
            </div>
        </div>
    );
}
