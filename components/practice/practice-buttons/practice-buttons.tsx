import React from "react";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import {Circle, RefreshCw, X} from "lucide-react";
import styles from "./practice-buttons.module.css"

type PracticeButtonsProps = {
    cardMode: string;
    typedAnswer: string;
    showAnswer: boolean;
    answerFeedback: string | null;
    handleSubmitTypingOrMark: () => void;
    handleNext: (rating: "correct" | "wrong", isRetry?: boolean) => void;
    handleGoOn: () => void;
    cardAnswerLength: number;
    isSubmitting: boolean;
};

export default function PracticeButtons({
                                            cardMode,
                                            typedAnswer,
                                            showAnswer,
                                            answerFeedback,
                                            handleSubmitTypingOrMark,
                                            handleNext,
                                            handleGoOn,
                                            cardAnswerLength,
                                            isSubmitting
                                        }: PracticeButtonsProps) {
    if (!showAnswer) {
        // Step 1: Refresh / submit
        return (
            <div className={styles.practiceGameButtons}>
                <Button
                    buttonColor={BUTTON_COLOR.orange}
                    onClick={handleSubmitTypingOrMark}
                    style={{width: cardMode === "typing" ? "350px" : "200px"}}
                    disabled={cardMode === "typing" && typedAnswer.length < cardAnswerLength && isSubmitting}
                >
                    <RefreshCw/>
                </Button>
            </div>
        );
    }

    if (!answerFeedback && cardMode !== "typing") {
        // Step 2: Mark buttons for normal cards
        return (
            <div className={styles.practiceGameButtons}>
                <Button
                    buttonColor={BUTTON_COLOR.red}
                    onClick={() => handleNext("wrong")}
                    disabled={isSubmitting}
                >
                    <X/>
                </Button>
                <Button
                    disabled={isSubmitting}
                    buttonColor={BUTTON_COLOR.orange}
                    onClick={() => handleNext("correct")}
                >
                    <Circle/>
                </Button>
            </div>
        );
    }

    // Step 3: Next button after feedback
    return (
        <div className={styles.practiceGameButtons}>
            <Button buttonColor={BUTTON_COLOR.orange} onClick={handleGoOn} style={{width: "200px"}}>
                Next →
            </Button>
        </div>
    );
}
