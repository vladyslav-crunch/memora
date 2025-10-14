import styles from "./input.module.css";
import * as React from "react";
import type {LucideIcon} from "lucide-react";

export enum INPUT_OPTION_CLASSES {
    base = "base",
    modal = "modal",
    error = "error",
}

type InputProps = {
    label?: string;
    icon?: LucideIcon;
    iconSize?: number;
    iconStrokeWidth?: number;
    hint?: string;
    error?: string | null;
    option?: `${INPUT_OPTION_CLASSES}`;
    onHintClick?: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            icon: Icon,
            iconSize = 23,
            iconStrokeWidth = 1.25,
            hint,
            onHintClick,
            error,
            option = INPUT_OPTION_CLASSES.base,
            ...rest
        },
        ref
    ) => {
        const inputClass = `
            ${styles.input} 
            ${option ? styles[option] : ""} 
            ${error ? styles.inputError : ""} 
            ${!Icon ? styles.noIcon : ""}
        `;

        return (
            <div>
                {label && <label className={styles.inputLabel}>{label}</label>}
                <div className={styles.inputContainer}>
                    {hint && (
                        <p className={styles.inputHint} onClick={onHintClick}>
                            {hint}
                        </p>
                    )}

                    {Icon && <Icon className={styles.icon} size={iconSize} strokeWidth={iconStrokeWidth}/>}
                    <input className={inputClass} ref={ref} {...rest} />
                    {error && (
                        <p
                            className={
                                option === INPUT_OPTION_CLASSES.modal
                                    ? styles.inputModalErrorHint
                                    : styles.inputErrorHint
                            }
                        >
                            {error}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;
