"use client"
import React, {useState} from 'react';
import styles from './practice-button.module.css'
import {Rocket} from "lucide-react";
import {useDueCards} from "@/hooks/useDueCards";
import {useRouter} from "next/navigation";
import {NoCardsModal} from "@/components/ui/no-cards-modal/no-cards.modal";
import {useCardsExist} from "@/hooks/useCardsExist";

function PracticeButton() {
    const {data, error} = useDueCards();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const {data: cardsExist} = useCardsExist();

    const startPractice = () => {
        router.push("/practice");
    }
    const checkDueCards = () => {
        if (data?.hasDue) {
            startPractice()
        } else {
            setOpen(true);
        }
    }
    if (!cardsExist?.exists) return null;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <>
            <button className={styles.practiceButtonContainer} onClick={checkDueCards}>
                <Rocket size={25}/>
                {data?.hasDue && <span className={styles.practiceButtonDueCounter}>{data.count}</span>}
            </button>
            {open && <NoCardsModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onConfirm={startPractice}
            />}
        </>
    );
}

export default PracticeButton;