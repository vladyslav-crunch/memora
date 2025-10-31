import styles from "@/components/header/logo/logo.module.css";
import Image from "next/image";

function Logo() {
    return (
        <div>
            <div className={styles.logo}>
                <Image
                    src="/logo.svg"
                    alt="Memora Logo"
                    width={72}
                    height={72}
                    priority
                />
            </div>
            <span className={styles.logoText}>Memora</span>
        </div>
    );
}

export default Logo;
