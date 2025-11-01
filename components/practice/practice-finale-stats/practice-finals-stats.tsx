import {CardStat} from "@/app/(protected-without-header)/practice/page";
import styles from "./practice-finals-stats.module.css";
import Button, {BUTTON_COLOR} from "@/components/ui/button/button";
import Link from "next/link";

type SessionCompleteProps = {
    stats: CardStat[];
};

export default function PracticeFinalsStats({stats}: SessionCompleteProps) {

    const uniqueStats = stats.filter((s) => !s.repeated);

    return (
        <div className={styles.finalStatsWrapper}>
            <div className={styles.finalCardsCount}>You have learnt <b>{uniqueStats.length}</b> cards</div>
            <div className={styles.finalStatsContainer}>
                <table className={styles.finalStatsTable}>
                    <thead>
                    <tr>
                        <th>Front</th>
                        <th>Interval Strength</th>
                        <th>Memory Level</th>
                    </tr>
                    </thead>
                    <tbody>
                    {uniqueStats.map((s, idx) => (
                        <tr key={idx}>
                            <td>
                                <div className={styles.clampedText}>{s.question}</div>
                            </td>
                            <td>
                                {s.oldStrength?.toFixed(2)} {s.correct ? "→" : "←"}{" "}
                                <b>{s.newStrength?.toFixed(2)}</b>
                            </td>
                            <td>{s.bucket}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Link href={'/'}><Button buttonColor={BUTTON_COLOR.orange} style={{width: "250px"}}>Back to
                home</Button></Link>
        </div>
    );
}
