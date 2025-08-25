"use client";
import React, {useEffect, useState} from "react";
import Spinner from "@/components/ui/spinner/spinner";
import {SessionCard, useCreateSession} from "@/hooks/useSession";
import styles from './practice.module.css'
import Link from "next/link";
import ProgressBar from "@/components/ui/progress-bar/progress-bar";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import {Circle, Flag, House, LayoutDashboard, MoveLeft, RefreshCw, X} from "lucide-react";


export default function Practice() {
    const {mutate, data: cards, isPending, isError} = useCreateSession();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const [learnedCards, setLearnedCards] = useState<SessionCard[]>([]);

    // start session immediately when page loads
    useEffect(() => {
        mutate();
    }, [mutate]);

    if (isPending) return <Spinner size={40}/>;
    if (isError) return <p>Failed to generate session</p>;
    if (!cards) return null;
    if (cards.length === 0) return <p>No cards due today 🎉</p>;

    const card = cards[currentIndex];

    const handleShowAnswer = () => setShowAnswer(true);

    const handleNext = (rating: "correct" | "wrong") => {
        // TODO: send rating to backend
        console.log(`Card ${card.cardId} rated: ${rating}`);

        // add card to learnedCards if not already included
        setLearnedCards((prev) =>
            prev.find((c) => c.cardId === card.cardId) ? prev : [...prev, card]
        );

        setShowAnswer(false);

        if (currentIndex < cards.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            console.log("Reached last card");
        }
    };

    const handleFinish = () => {
        setSessionComplete(true);
        console.log("Session finished. Learned cards:", learnedCards);
    };

    if (sessionComplete) {
        return (
            <div>
                <h1>Session Complete! 🎉</h1>
                <h2>Cards you studied:</h2>
                <ul>
                    {learnedCards.map((c) => (
                        <li key={c.cardId}>
                            <strong>Q:</strong> {c.question} | <strong>A:</strong> {c.answer}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className={styles.practiceContainer}>
            <div className={styles.practiceHeader}>
                <Link href={"/"}>
                    <button><MoveLeft/>Back to dashboard</button>
                </Link>
                <button onClick={handleFinish}><Flag/>Finish Session</button>
            </div>
            <div className={styles.practiceGameContainer}>
                <div className={styles.practiceGame}>
                    <div className={styles.practiceGameProgression}>
                        <ProgressBar current={currentIndex + 1} total={cards.length}/>
                        <p>
                            {currentIndex + 1}/{cards.length}
                        </p>
                    </div>
                    <div className={styles.practiceGameCard}>
                        <p>{card.question}</p>
                        {showAnswer && (
                            <div>
                                <p>A: {card.answer}</p>
                                {card.context && <p>{card.context}</p>}
                                <p>Mode: {card.mode}</p>
                            </div>
                        )}
                    </div>

                    <div className={styles.practiceGameQuestions}>
                        {!showAnswer ? <p>Guess the answer</p> : <p>Did you remember correctly?</p>}
                    </div>

                    <div className={styles.practiceGameButtons}>
                        {!showAnswer ? (
                            <>
                                <Button buttonColor={BUTTON_COLOR.orange} onClick={handleShowAnswer}
                                        style={{width: "350px"}}><RefreshCw/></Button>
                            </>
                        ) : (
                            <>
                                <Button buttonColor={BUTTON_COLOR.red}
                                        onClick={() => handleNext("correct")}><X/></Button>
                                <Button buttonColor={BUTTON_COLOR.orange}
                                        onClick={() => handleNext("wrong")}><Circle/></Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
