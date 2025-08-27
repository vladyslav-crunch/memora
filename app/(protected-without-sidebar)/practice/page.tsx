"use client";
import React, {useEffect, useState} from "react";
import Spinner from "@/components/ui/spinner/spinner";
import {SessionCard, useCreateSession} from "@/hooks/useSession";
import styles from "./practice.module.css";
import Link from "next/link";
import ProgressBar from "@/components/ui/progress-bar/progress-bar";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import {Circle, Flag, MoveLeft, RefreshCw, X} from "lucide-react";

// helper to calculate bucket like server
function bucketFromInterval(intervalStrength: number | null | undefined) {
    const v = typeof intervalStrength === "number" ? intervalStrength : 0;
    if (v >= 0.75) return "high";
    if (v >= 0.5) return "mid";
    if (v >= 0.25) return "low";
    return "veryLow";
}

type CardStat = {
    cardId: number;
    question: string;
    answer: string;
    oldStrength: number | null;
    newStrength: number | null;
    bucket: string;
    correct: boolean;
    repeated: boolean;
};

export default function Practice() {
    const {mutate, data, isPending, isError} = useCreateSession();
    const session = data?.session ?? [];
    const sessionType = data?.sessionType ?? "generated";

    const [queue, setQueue] = useState<SessionCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [stats, setStats] = useState<CardStat[]>([]);
    const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);

    // start session immediately
    useEffect(() => {
        mutate();
    }, [mutate]);

    // fill queue once session arrives
    useEffect(() => {
        if (session.length) {
            setQueue(session);
            setCurrentIndex(0);
            setShowAnswer(false);
            setAnswerFeedback(null);
            setStats([]);
        }
    }, [session]);

    if (isPending) return <Spinner size={40}/>;
    if (isError) return <p>Failed to generate session</p>;
    if (!data) return null;
    if (session.length === 0) return <p>No cards due today 🎉</p>;

    // Session complete when index past queue length
    if (currentIndex >= queue.length) {
        return (
            <div>
                <h1>Session Complete! 🎉</h1>
                <h2>Cards you studied:</h2>
                <ul>
                    {stats.map((s, idx) => (
                        <li key={idx}>
                            <strong>Q:</strong> {s.question} | <strong>A:</strong> {s.answer} →{" "}
                            {s.oldStrength?.toFixed(2)} {s.correct ? "→" : "←"}{" "}
                            {s.newStrength?.toFixed(2)} {s.bucket}
                            {s.repeated && " (retry)"}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    const card = queue[currentIndex];

    const handleShowAnswer = () => setShowAnswer(true);
    const handleNext = async (rating: "correct" | "wrong", isRetry = false) => {
        const oldStrength = card.intervalStrength ?? 0;
        let newStrength = oldStrength;
        let bucket = bucketFromInterval(oldStrength);
        const now = new Date();

        const nextRepIso = card.nextRepetitionTime;

        const isDueClient = card.isDue || !nextRepIso || new Date(nextRepIso) <= now;

        const shouldCallApi = !isRetry && sessionType === "due" && isDueClient;

        if (shouldCallApi) {
            try {
                const res = await fetch(`/api/cards/${card.cardId}/answer`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({isCorrect: rating === "correct"}),
                });

                if (!res.ok) throw new Error(`Failed to update card: ${res.status}`);
                const updated = await res.json();

                newStrength = updated.intervalStrength ?? oldStrength;
                bucket = bucketFromInterval(newStrength);
            } catch (err) {
                console.error("Error submitting answer:", err);
            }
        } else {
            // generated session OR not due OR retry: do not call API
            // Optionally: compute a predicted newStrength locally using SRS logic to show user
            newStrength = oldStrength;
            bucket = bucketFromInterval(newStrength);
        }

        // show feedback text under card (user must press "Go on →" to continue)
        const arrow = rating === "correct" ? "→" : "←";
        setAnswerFeedback(`${oldStrength.toFixed(2)} ${arrow} ${newStrength.toFixed(2)} ${bucket}`);

        // store stats for summary
        setStats((prev) => [
            ...prev,
            {
                cardId: card.cardId,
                question: card.question,
                answer: card.answer,
                oldStrength,
                newStrength,
                bucket,
                correct: rating === "correct",
                repeated: isRetry,
            },
        ]);

        // if wrong on first try, push card at end for retry (always client-side)
        if (rating === "wrong") {
            setQueue((prev) => [...prev, card]);
        }
    };

    const handleGoOn = () => {
        setAnswerFeedback(null);
        setShowAnswer(false);
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <div className={styles.practiceContainer}>
            <div className={styles.practiceHeader}>
                <Link href={"/"}>
                    <button>
                        <MoveLeft/> Back to dashboard
                    </button>
                </Link>

                <button onClick={() => setCurrentIndex(queue.length)}>
                    <Flag/> Finish Session
                </button>
            </div>


            <div style={{margin: "8px 0", fontSize: 13, color: "#666"}}>
                {sessionType === "generated" ? (
                    <strong>Practice mode — changes are NOT saved to your account.</strong>
                ) : (
                    <strong>Due session — answers will update your schedule.</strong>
                )}
                <p>{card.mode}</p>
            </div>

            <div className={styles.practiceGameContainer}>
                <div className={styles.practiceGame}>
                    <div className={styles.practiceGameProgression}>
                        <ProgressBar current={currentIndex + 1} total={queue.length}/>
                        <p>
                            {currentIndex + 1}/{queue.length}
                        </p>
                    </div>

                    <div className={styles.practiceGameCard}>

                        {showAnswer ? (
                            <div className={styles.practiceGameCardAnswer}>
                                <p className={styles.answerQustion}>{card.question}</p>
                                <hr className={styles.answerDivider}/>
                                <p className={styles.answerAnswer}>{card.answer}</p>
                                {card.context && <p className={styles.answerContext}>{card.context}</p>}
                            </div>
                        ) : <p>{card.question}</p>}
                    </div>

                    <div className={styles.practiceGameQuestions}>
                        {!showAnswer ? (
                            <p>Guess the answer</p>
                        ) : !answerFeedback ? (
                            <p>Did you remember correctly?</p>
                        ) : (
                            <p>{answerFeedback}</p>
                        )}
                    </div>

                    <div className={styles.practiceGameButtons}>
                        {!showAnswer ? (
                            <Button buttonColor={BUTTON_COLOR.orange} onClick={handleShowAnswer}
                                    style={{width: "350px"}}>
                                <RefreshCw/>
                            </Button>
                        ) : answerFeedback ? (
                            <Button buttonColor={BUTTON_COLOR.orange} onClick={handleGoOn} style={{width: "200px"}}>
                                Next →
                            </Button>
                        ) : (
                            <>
                                <Button
                                    buttonColor={BUTTON_COLOR.red}
                                    onClick={() => handleNext("wrong", currentIndex >= session.length)}
                                >
                                    <X/>
                                </Button>
                                <Button
                                    buttonColor={BUTTON_COLOR.orange}
                                    onClick={() => handleNext("correct", currentIndex >= session.length)}
                                >
                                    <Circle/>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
