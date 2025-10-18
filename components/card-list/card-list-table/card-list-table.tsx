import React from 'react';
import styles from './card-list-table.module.css'
import Checkbox from "@/components/ui/checkbox/checkbox";
import {bucketFromInterval} from "@/lib/api/progression-helpers";
import {formatNextRepetitionTimeCardList} from "@/lib/utility/formatNextRepetitionDashboard";
import {Card, CardListResponse} from "@/lib/types/card.types";

type CardListTableProps = {
    cards: CardListResponse;
    selectedCards: Card[];
    onToggleAll: () => void;
    onToggleRow: (card: Card) => void;
}


function CardListTable({cards, selectedCards, onToggleAll, onToggleRow}: CardListTableProps) {

    const allSelected = selectedCards.length === cards.items.length;

    const isCardSelected = (card: Card) =>
        selectedCards.some((c) => c.id === card.id);


    return (
        <div className={styles.cardTableContainer}>
            <table className={styles.table}>
                <colgroup>
                    <col style={{width: "2%"}}/>
                    <col style={{width: "40%"}}/>
                    <col style={{width: "10%", textAlign: "center"}}/>
                    <col style={{width: "20%"}}/>
                    <col style={{width: "10%"}}/>
                </colgroup>
                <thead className={styles.thead}>
                <tr>
                    <th className={styles.th}>
                        <Checkbox checked={allSelected} onChange={onToggleAll}/>
                    </th>
                    <th className={styles.th}>Front/Back/Context</th>
                    <th className={styles.th}>Interval strength</th>
                    <th className={styles.th}>Next repetition</th>
                    <th className={styles.th}>Memory Level</th>
                </tr>
                </thead>
                <tbody>
                {cards.items.map((card: Card) => {
                    const level = bucketFromInterval(card.intervalStrength);
                    return (
                        <tr
                            key={card.id}
                            className={`${styles.tr} ${
                                isCardSelected(card) ? styles.selected : ""
                            }`}
                        >
                            <td className={styles.td}>
                                <Checkbox
                                    checked={isCardSelected(card)}
                                    onChange={() => onToggleRow(card)}
                                />
                            </td>
                            <td className={styles.td}>
                                <p className={styles.cardFront}>{card.front}</p>
                                <p className={styles.cardBack}>{card.back}</p>
                                <p className={styles.cardContext}>{card.context}</p>
                            </td>
                            <td className={styles.td}>{card.intervalStrength}</td>
                            <td className={styles.td}>
                                {card.nextRepetitionTime ? formatNextRepetitionTimeCardList(card.nextRepetitionTime) :
                                    <p>-</p>}
                            </td>
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
    )
}

export default CardListTable;