import Image from "next/image";
import styles from "@/components/header/logo.module.css";

function Logo() {
    return (
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
    );
}

export default Logo;