import React from "react";
import styles from "@/app/(protected-without-header)/practice/practice.module.css";

type PracticeGameQuestionsProps = {
    cardMode: string;
    showAnswer: boolean;
    answerFeedback: string | null;
    resultMessage: string | null;
};

export default function PracticeQuestions({
                                              cardMode,
                                              showAnswer,
                                              answerFeedback,
                                              resultMessage,
                                          }: PracticeGameQuestionsProps) {
    return (
        <div className={styles.practiceGameQuestions}>
            {!showAnswer ? (
                <p>{cardMode === "typing" ? "Type the answer" : "Guess the answer"}</p>
            ) : !answerFeedback ? (
                <p>Did you remember correctly?</p>
            ) : (
                <>
                    {resultMessage && <p style={{fontWeight: "bold"}}>{resultMessage}</p>}
                    <p>{answerFeedback}</p>
                </>
            )}
        </div>
    );
}
