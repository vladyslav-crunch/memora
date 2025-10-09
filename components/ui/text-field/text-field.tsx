import styles from "@/components/ui/input/input.module.css";
import * as React from "react";
import {INPUT_OPTION_CLASSES} from "@/components/ui/input/input";


type TextareaProps = {
    label?: string;
    error?: string | null;
    option?: `${INPUT_OPTION_CLASSES}`;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            option = INPUT_OPTION_CLASSES.base,
            ...rest
        },
        ref
    ) => {
        const textareaClass = `
      ${styles.textArea}
      ${option ? styles[option] : ""}
      ${error ? styles.inputError : ""}
    `;

        return (
            <div>
                {label && <label className={styles.inputLabel}>{label}</label>}
                <div className={styles.inputContainer}>
                    <textarea
                        className={textareaClass}
                        ref={ref}
                        {...rest}
                        rows={rest.rows ?? 4}
                    />

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

Textarea.displayName = "Textarea";
export default Textarea;
