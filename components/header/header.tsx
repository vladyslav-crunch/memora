// components/Header.tsx
"use client";

import Image from "next/image";
import styles from "./header.module.css";

export default function Header() {
    return (
        <header className={styles.headerContiner}>
            <div className={styles.headerLogo}>
                <Image
                    src="/logo.svg"
                    alt="Memora Logo"
                    width={72}
                    height={72}
                    priority
                />
                <span>Memora</span>
            </div>

            {/* right side (keep empty for now, add buttons later) */}
            <div/>
        </header>
    );
}
