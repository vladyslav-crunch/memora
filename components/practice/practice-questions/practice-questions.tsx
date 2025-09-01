import React from "react";
import styles from "./practice-questions.module.css";

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
    // pick color for result message
    const resultColor =
        resultMessage === "Good job" ? "#3ea61c" : "#ed6464"

    return (
        <div className={styles.practiceGameQuestions}>
            {!showAnswer ? (
                <p>{cardMode === "typing" ? "Type the answer" : "Guess the answer"}</p>
            ) : !answerFeedback ? (
                <p>Did you remember correctly?</p>
            ) : (
                <>
                    {resultMessage && (
                        <p style={{fontWeight: "bold", color: resultColor, textAlign: "center"}}>
                            {resultMessage}
                        </p>
                    )}
                    <p>{answerFeedback}</p>
                </>
            )}
        </div>
    );
}
