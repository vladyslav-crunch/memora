import React from 'react';
import styles from "@/app/(protected-without-header)/practice/practice.module.css";
import ProgressBar from "@/components/ui/progress-bar/progress-bar";

type PracticeProgressionProps = {
    currentIndex: number;
    queueLength: number;
}

function PracticeProgression({currentIndex, queueLength}: PracticeProgressionProps) {
    return (
        <div className={styles.practiceGameProgression}>
            <ProgressBar current={currentIndex + 1} total={queueLength}/>
            <p>{currentIndex + 1}/{queueLength}</p>
        </div>
    );
}

export default PracticeProgression;