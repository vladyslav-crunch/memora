"use client"
import React, {useState} from 'react';
import styles from './practice-button.module.css'
import {Rocket} from "lucide-react";
import {useDueCards} from "@/hooks/useDueCards";
import {ConfirmModal} from "@/components/ui/confirm-modal/confirm-modal";
import {useRouter} from "next/navigation";

function PracticeButton() {
    const {data, error} = useDueCards();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const startPractice = () => {
        router.push("/practice");
    }
    const checkDueCards = () => {
        if (data?.hasDue) {
            router.push("/practice");
        } else {
            setOpen(true);
        }
    }

    if (error) return <p>Error: {error.message}</p>;
    return (
        <>
            <button className={styles.practiceButtonContainer} onClick={checkDueCards}>
                <Rocket size={25}/>
                {data?.hasDue && <span className={styles.practiceButtonDueCounter}>{data.count}</span>}
            </button>
            {open && <ConfirmModal isOpen={open} onClose={() => setOpen(false)} onConfirm={startPractice}
                                   title={"No cards to learn"}
                                   message={"You have finished yours learning session. (You can still proceed by clicking \"Learn anyway\", but it will not affect the interval days)"}
                                   confirmLabel={"Learn anyway"}/>}
        </>
    );
}

export default PracticeButton;