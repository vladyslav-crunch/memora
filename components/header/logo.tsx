import styles from "@/components/header/logo.module.css";

function Logo() {
    return (
        <div className={styles.headerLogo}>
            <img
                src="/logo.svg"
                alt="Memora Logo"
                width={72}    // як було в Image
                height={72}   // як було в Image
                style={{width: "72px", height: "72px"}} // фіксовані розміри
            />
            <span>Memora</span>
        </div>
    );
}

export default Logo;
