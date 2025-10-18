import styles from "@/components/header/logo.module.css";
import Image from "next/image";

function Logo() {
    return (
        <div className={styles.headerLogo}>
            <Image
                src="/logo.svg"
                alt="Memora Logo"
                width={72}    // як було в Image
                height={72}   // як було в Image
                style={{width: "72px", height: "72px"}} // фіксовані розміри
                priority
            />
            <span>Memora</span>
        </div>
    );
}

export default Logo;
