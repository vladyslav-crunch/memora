"use client";
import React from "react";
import styles from "./checkbox.module.css";

interface CustomCheckboxProps {
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
}

const Checkbox: React.FC<CustomCheckboxProps> = ({checked, onChange, disabled}) => {
    return (
        <label className={styles.checkboxContainer}>
            <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}/>
            <span className={styles.checkmark}></span>
        </label>
    );
};

export default Checkbox;
