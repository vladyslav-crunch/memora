import * as React from "react";
import styles from "./button.module.css";

export enum BUTTON_VARIANT {
    base = "base",
    modal = "modal",
}

export enum BUTTON_COLOR {
    orange = "orange",
    google = "google",
    red = "red",
    white = "white",
    cancel = "cancel",
    orangeLight = "orangeLight",
}

type ButtonProps = {
    children: React.ReactNode;
    buttonType?: BUTTON_VARIANT;
    buttonColor?: BUTTON_COLOR;
    icon?: React.ElementType;
    iconSize?: number;
    iconColor?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
                    children,
                    buttonType = BUTTON_VARIANT.base,
                    buttonColor = BUTTON_COLOR.white,
                    icon: Icon,
                    iconSize = 20,
                    iconColor,
                    ...rest
                }: ButtonProps) {
    const buttonClass = `${styles.button} ${styles[buttonType]} ${styles[buttonColor]}`;

    return (
        <button className={buttonClass} {...rest}>
            {Icon && (
                <Icon
                    className={styles.buttonIcon}
                    size={iconSize}
                    color={iconColor}
                />
            )}
            <span className={styles.buttonText}>{children}</span>
        </button>
    );
}

export default Button;
