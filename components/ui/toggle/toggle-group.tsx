"use client";
import React from "react";
import styles from "./toggle-group.module.css";

export type ToggleOption = { id: string; label: string };

type Props = {
    label?: string;
    options: ToggleOption[];
    value: string[];
    onChange: (next: string[]) => void;
    minSelected?: number;
    maxSelected?: number;
    className?: string;
};

export default function ToggleGroup({
                                        label,
                                        options,
                                        value,
                                        onChange,
                                        minSelected = 1,
                                        maxSelected,
                                        className = "",
                                    }: Props) {
    const set = new Set(value);

    function toggle(id: string) {
        const next = new Set(set);
        if (next.has(id)) {
            // trying to deselect
            if (next.size <= minSelected) return; // enforce at least one
            next.delete(id);
        } else {
            // trying to select
            if (typeof maxSelected === "number" && next.size >= maxSelected) return; // enforce max
            next.add(id);
        }
        onChange(Array.from(next));
    }

    return (
        <div>
            {label && <label className={styles.toggleLabel}>{label}</label>}
            <div className={[styles.group, className].join(" ")} role="group">
                {options.map((opt) => {
                    const pressed = set.has(opt.id);
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            aria-pressed={pressed}
                            onClick={() => toggle(opt.id)}
                            className={`${styles.toggle} ${pressed ? styles.on : styles.off}`}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
