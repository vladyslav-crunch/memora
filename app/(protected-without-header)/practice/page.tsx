"use client";
import React, {useEffect, useState} from "react";
import Spinner from "@/components/ui/spinner/spinner";
import {SessionCard, useCreateSession} from "@/hooks/useSession";
import styles from "./practice.module.css";
import {bucketFromInterval} from "@/lib/api/progression-helpers";
import PracticeHeader from "@/components/practice/practice-header/practice-header";
import PracticeCard from "@/components/practice/practice-card/practice-card";
import PracticeQuestions from "@/components/practice/practice-questions/practice-questions";
import PracticeButtons from "@/components/practice/practice-buttons/practice-buttons";
import PracticeFinalsStats from "@/components/practice/practice-finale-stats/practice-finals-stats";
import PracticeProgression from "@/components/practice/practice-progression/practice-progression";
import PracticeDeck from "@/components/practice/practice-deck/practice-deck";
import {useSearchParams} from "next/navigation";


export type CardStat = {
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
    const searchParams = useSearchParams();
    const deckIdParam = searchParams.get("deckId");
    const deckId = deckIdParam ? Number(deckIdParam) : undefined;
    const {mutate, data, isPending, isError} = useCreateSession(deckId);
    const session = React.useMemo(() => data?.session ?? [], [data]);
    const sessionType = data?.sessionType ?? "generated";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [queue, setQueue] = useState<SessionCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [stats, setStats] = useState<CardStat[]>([]);
    const [resultMessage, setResultMessage] = useState<string | null>(null);
    const [answerFeedback, setAnswerFeedback] = useState<string | null>(null);
    const [typedAnswer, setTypedAnswer] = useState("");

    useEffect(() => {
        mutate();
    }, [mutate]);

    useEffect(() => {
        if (session.length) {
            setQueue(session);
            setCurrentIndex(0);
            setShowAnswer(false);
            setAnswerFeedback(null);
            setStats([]);
            setTypedAnswer("");
        }
    }, [session]);

    if (isPending) return <Spinner size={40}/>;
    if (isError) return <p>Failed to generate session</p>;
    if (!data) return null;
    if (session.length === 0) return <p>No cards due today 🎉</p>;

    if (currentIndex >= queue.length) {
        return <PracticeFinalsStats stats={stats}/>;
    }

    const card = queue[currentIndex];

    const handleNext = async (rating: "correct" | "wrong") => {
        if (isSubmitting) return; // prevent double clicks
        setIsSubmitting(true); // start loading

        const oldStrength = card.intervalStrength ?? 0;
        let newStrength = oldStrength;
        let bucket = bucketFromInterval(oldStrength);
        const now = new Date();

        const nextRepIso = card.nextRepetitionTime;
        const isDueClient = card.isDue || !nextRepIso || new Date(nextRepIso) <= now;
        const shouldCallApi = !card.isRepeated && sessionType === "due" && isDueClient;

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
            newStrength = oldStrength;
            bucket = bucketFromInterval(newStrength);
        }

        const arrow = rating === "correct" ? "→" : "←";

        setResultMessage(rating === "correct" ? "Good job" : "Wrong, this question will be repeated");

        setAnswerFeedback(
            `${oldStrength.toFixed(2)} ${arrow} ${newStrength.toFixed(2)} ${bucket}`
        );

        setStats((prev) => {
            const isAlreadyAnswered = prev.some((st) => st.cardId === card.cardId);
            return [
                ...prev,
                {
                    cardId: card.cardId,
                    question: card.question,
                    answer: card.answer,
                    oldStrength,
                    newStrength,
                    bucket,
                    correct: rating === "correct",
                    repeated: isAlreadyAnswered,
                },
            ];
        });

        if (rating === "wrong") {
            if (rating === "wrong") {
                setQueue((prev) => [...prev, {...card, isRepeated: true}]);
            }
        }
        setShowAnswer(true);
        setIsSubmitting(false);
    };


    const handleTypingSubmit = async () => {
        if (!card) return;

        // prevent submission until fully typed
        if (typedAnswer.length < card.answer.length) return;

        const isCorrect =
            typedAnswer.trim().toLowerCase() === card.answer.trim().toLowerCase();
        await handleNext(isCorrect ? "correct" : "wrong");
        setTypedAnswer("");
    };

    const handleSubmitTypingOrMark = () => {
        if (card.mode === "typing") {
            handleTypingSubmit();
        } else {
            setShowAnswer(true);
        }
    };

    const handleGoOn = () => {
        setAnswerFeedback(null);
        setShowAnswer(false);
        setTypedAnswer("");
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <div className={styles.practiceContainer}>
            <PracticeHeader onFinish={() => setCurrentIndex(queue.length)}/>

            {/*<div style={{margin: "8px 0", fontSize: 13, color: "#666"}}>*/}
            {/*    {sessionType === "generated" ? (*/}
            {/*        <strong>Practice mode — changes are NOT saved to your account.</strong>*/}
            {/*    ) : (*/}
            {/*        <strong>Due session — answers will update your schedule.</strong>*/}
            {/*    )}*/}
            {/*</div>*/}

            <div className={styles.practiceGameContainer}>
                <div className={styles.practiceGame}>
                    <PracticeProgression currentIndex={currentIndex} queueLength={queue.length}/>
                    <PracticeDeck deckName={card.deckName}/>
                    <PracticeCard
                        card={card}
                        typedAnswer={typedAnswer}
                        setTypedAnswer={setTypedAnswer}
                        answerFeedback={answerFeedback}
                        showAnswer={showAnswer}
                        handleSubmitTypingOrMark={handleSubmitTypingOrMark}
                    />

                    <PracticeQuestions
                        cardMode={card.mode}
                        showAnswer={showAnswer}
                        answerFeedback={answerFeedback}
                        resultMessage={resultMessage}
                    />

                    <PracticeButtons
                        cardMode={card.mode}
                        typedAnswer={typedAnswer}
                        showAnswer={showAnswer}
                        answerFeedback={answerFeedback}
                        cardAnswerLength={card.answer.length}
                        handleSubmitTypingOrMark={handleSubmitTypingOrMark}
                        handleNext={handleNext}
                        handleGoOn={handleGoOn}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </div>
    );
}
