import React from "react";
import styles from "./practice-card.module.css"
import TypingInput from "@/components/ui/typing-input/typing-input";
import {SessionCard} from "@/hooks/useSession";
import {getFontSize} from "@/lib/utility/getFontSize";

type PracticeGameCardProps = {
    card: SessionCard;
    typedAnswer: string;
    setTypedAnswer: (val: string) => void;
    answerFeedback: string | null;
    showAnswer: boolean;
    handleSubmitTypingOrMark: () => void;
};

export default function PracticeCard({
                                         card,
                                         typedAnswer,
                                         setTypedAnswer,
                                         answerFeedback,
                                         showAnswer,
                                         handleSubmitTypingOrMark,
                                     }: PracticeGameCardProps) {
    return (
        <div className={styles.practiceGameCardContainer}>
            {card.mode === "typing" && !answerFeedback ? (
                <>
                    <p className={styles.answerQustion}
                       style={{fontSize: getFontSize(card.question)}}>{card.question}</p>
                    <TypingInput
                        word={card.answer.toUpperCase()}
                        value={typedAnswer}
                        onChange={setTypedAnswer}
                        onEnter={handleSubmitTypingOrMark}
                    />
                </>
            ) : showAnswer || answerFeedback ? (
                <div className={styles.practiceGameCardAnswer}>
                    <p className={styles.answerQustion}
                       style={{fontSize: getFontSize(card.question)}}>{card.question}</p>
                    <hr className={styles.answerDivider}/>
                    <p className={styles.answerAnswer} style={{fontSize: getFontSize(card.answer)}}>{card.answer}</p>
                    {card.context && (
                        <p className={styles.answerContext}>{card.context}</p>
                    )}
                </div>
            ) : (
                <p style={{fontSize: getFontSize(card.question)}}>{card.question}</p>
            )}

            <span className={styles.practiceCardMode}>Mode: {card.mode}</span>
        </div>
    );
}
