import React from 'react';
import styles from "@/app/(protected-without-header)/practice/practice.module.css";
import Link from "next/link";
import {Flag, MoveLeft} from "lucide-react";

type PracticeHeaderProps = {
    onFinish: () => void;
}


function PracticeHeader({onFinish}: PracticeHeaderProps) {
    return (
        <div className={styles.practiceHeader}>
            <Link href={"/"}>
                <button>
                    <MoveLeft/> Back to dashboard
                </button>
            </Link>
            <button onClick={onFinish}>
                <Flag/> Finish Session
            </button>
        </div>
    );
}

export default PracticeHeader;