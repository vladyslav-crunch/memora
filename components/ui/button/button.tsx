import * as React from "react";
import styles from "./button.module.css"


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
}

type ButtonProps = {
    children: React.ReactNode;
    buttonType?: BUTTON_VARIANT;
    buttonColor?: BUTTON_COLOR;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function Button({children, buttonType = BUTTON_VARIANT.base, buttonColor = BUTTON_COLOR.white, ...rest}: ButtonProps) {
    const buttonClass = `${styles.button} ${styles[buttonType]} ${styles[buttonColor]}`;
    return (
        <button className={buttonClass} {...rest}>
            {children}
        </button>
    );
}

export default Button;