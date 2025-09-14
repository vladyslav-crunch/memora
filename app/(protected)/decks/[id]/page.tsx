"use client";
import styles from './deck-page.module.css';
import React, {use, useState} from "react";
import {useCards} from "@/hooks/useCards";
import {bucketFromInterval} from "@/lib/api/progression-helpers";
import {FolderInput, Pencil, Trash2} from "lucide-react";
import Checkbox from "@/components/ui/checkbox/checkbox";

function DeckPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = use(params);
    const {data: cards, isLoading, error} = useCards(Number(id));

    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    console.log(selectedRows);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Failed to load deck</div>;
    if (!cards) return <div>No deck found</div>;

    function formatDateTime(dateString: string) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const allSelected = selectedRows.length === cards.items.length;

    const toggleAll = () => {
        if (allSelected) {
            setSelectedRows([]);
        } else {
            setSelectedRows(cards.items.map((c: any) => c.id));
        }
    };

    const toggleRow = (id: number) => {
        setSelectedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        );
    };

    return (
        <>
            <h1 className={styles.title}>Deck {id}</h1>
            <div className={styles.cardTableContainer}>
                <table className={styles.table}>
                    <colgroup>
                        <col style={{width: '2%'}}/>
                        {/* Checkbox column */}
                        <col style={{width: '40%'}}/>
                        {/* Front/Back */}
                        <col style={{width: '10%', textAlign: 'center'}}/>
                        {/* Interval strength */}
                        <col style={{width: '20%'}}/>
                        {/* Next repetition */}
                        <col style={{width: '10%'}}/>
                        {/* Memory level */}
                    </colgroup>
                    <thead className={styles.thead}>
                    <tr>
                        <th className={styles.th}>
                            <Checkbox checked={allSelected} onChange={toggleAll}/>
                        </th>
                        <th className={styles.th}>Front/Back/Context</th>
                        <th className={styles.th}>Interval strength</th>
                        <th className={styles.th}>Next repetition</th>
                        <th className={styles.th}>Memory Level</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cards.items.map((card: any) => {
                        const level = bucketFromInterval(card.intervalStrength); // e.g. "veryLow", "low", "mid", "high"
                        return (
                            <tr
                                key={card.id}
                                className={`${styles.tr} ${
                                    selectedRows.includes(card.id) ? styles.selected : ""
                                }`}
                            >
                                <td className={styles.td}>
                                    <Checkbox
                                        checked={selectedRows.includes(card.id)}
                                        onChange={() => toggleRow(card.id)}
                                    />
                                </td>
                                <td className={styles.td}>
                                    <p className={styles.cardFront}>{card.front}</p>
                                    <p className={styles.cardBack}>{card.back}</p>
                                    <p className={styles.cardContext}>{card.context}</p>
                                </td>
                                <td className={styles.td}>{card.intervalStrength}</td>
                                <td className={styles.td}>{formatDateTime(card.nextRepetitionTime)}</td>
                                <td className={styles.td}>
                                    <span
                                        className={`${styles.cardLevel} ${
                                            styles[level] || ""
                                        }`}
                                    >
                                        {level}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
            <footer className={styles.cardsFooter}>
                <div>
                    <h2>Total cards: {cards.items.length}</h2>
                </div>
                <div className={styles.cardsFooterButtons}>
                    <button style={{backgroundColor: "#EF6565"}}><Trash2/></button>
                    <button style={{backgroundColor: "#A983B7"}}><FolderInput/></button>
                    <button style={{backgroundColor: "#F98974"}}><Pencil/></button>
                </div>
            </footer>
        </>
    );
}

export default DeckPage;
