"use client";
import React, {useEffect, useState, useRef} from "react";

type TypingInputProps = {
    word: string;           // target word
    value: string;          // typed value from parent
    onChange: (val: string) => void;
    onEnter?: () => void;
};

export default function TypingInput({word, value, onChange, onEnter}: TypingInputProps) {
    const [cursorVisible, setCursorVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => setCursorVisible(v => !v), 500);
        return () => clearInterval(interval);
    }, []);

    // capture key input
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Backspace") {
                onChange(value.slice(0, -1));
            } else if (e.key.length === 1 && value.length < word.length) {
                onChange(value + e.key.toUpperCase());
            } else if (e.key === "Enter" && onEnter) {
                onEnter();
            }
        };

        const el = containerRef.current;
        el?.focus();
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [value, onChange, word.length, onEnter]);

    const renderWord = () => {
        return word.split("").map((char, idx) => {
            const typedChar = value[idx];
            const isCursor = idx === value.length;
            return (
                <span
                    key={idx}
                    style={{
                        display: "inline-block",
                        width: "20px",
                        textAlign: "center",
                        fontFamily: "monospace",
                        fontSize: "24px",
                    }}
                >
        {typedChar
            ? typedChar
            : isCursor
                ? (cursorVisible ? "_" : " ") // blink effect here
                : "_"}
      </span>
            );
        });
    };


    return (
        <div
            ref={containerRef}
            tabIndex={0} // make div focusable
            style={{outline: "none", cursor: "text"}}
        >
            {renderWord()}
        </div>
    );
}
