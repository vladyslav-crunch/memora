import React from 'react';
import styles from "./practice-header.module.css";
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
                    <MoveLeft/> <span>Back to dashboard</span>
                </button>
            </Link>
            <button onClick={onFinish}>
                <Flag/> <span>Finish Session</span>
            </button>
        </div>
    );
}

export default PracticeHeader;