"use client";
import React from "react";
import styles from "./switch.module.css";

type Props = {
    label: string;
    checked: boolean;
    onChange: (next: boolean) => void;
};

export default function Switch({checked, onChange, label}: Props) {
    return (
        <div className={styles.switchWrapper}>
            <label className={styles.switchLabel}>{label}</label>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`${styles.switch} ${checked ? styles.on : styles.off}`}
            >
                <span className={styles.thumb}/>
            </button>
        </div>
    );
}
