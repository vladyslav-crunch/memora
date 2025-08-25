"use client";
import React, {useEffect, useState} from "react";
import styles from './progress-bar.module.css'

type ProgressBarProps = {
    current: number;
    total: number;
};

export default function ProgressBar({current, total}: ProgressBarProps) {
    const percentage = (current / total) * 100;
    const [width, setWidth] = useState(0);

    // animate width change
    useEffect(() => {
        setWidth(percentage);
    }, [percentage]);

    return (
        <div className={styles.track}>
            <div className={styles.fill}
                 style={{
                     width: `${width}%`,
                 }}
            />
        </div>
    );
}
