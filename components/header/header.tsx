import styles from "./header.module.css";
import Logo from "@/components/header/logo";
import SearchBar from "@/components/header/search-bar";
import ProfileMenu from "@/components/header/profile-menu";
import Link from "next/link";
import PracticeButton from "@/components/header/practice-button";

type HeaderMode = "auth" | "dashboard" | "learning";

type HeaderProps = {
    mode?: HeaderMode;
};

export default function Header({mode}: HeaderProps) {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerLeftSide}>
                <Link href={"/"}><Logo/></Link>
            </div>
            {mode !== "auth" && <div className={styles.headerRightSide}>
                <PracticeButton/>
                <SearchBar/>
                <ProfileMenu/>
            </div>}
        </header>
    );
}
