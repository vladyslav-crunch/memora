import React, {useState} from 'react';
import {useDeck} from "@/hooks/useDecks";
import {ArrowLeft, ListFilter, PlusIcon} from "lucide-react";
import AddCardModal from "@/components/dashboard/cards/modals/add-card-modal";
import styles from './card-list-header.module.css'
import {useRouter} from "next/navigation";
import {Deck} from "@/lib/types/api";


type CardListHeaderProps = {
    deck: Deck;
    onSort: () => void;
}

function CardListHeader({deck, onSort}: CardListHeaderProps) {

    const [isAddOpen, setIsAddOpen] = useState(false);
    const router = useRouter();
    return (
        <div className={styles.cardListHeaderContainer}>
            <p className={styles.cardListHeaderTitle}><ArrowLeft size={30}
                                                                 onClick={() => router.back()}
                                                                 className={'cursor-pointer'}/>{deck?.name}
            </p>
            <div className={styles.cardListHeaderButtons}>
                <ListFilter size={30} className="cursor-pointer" onClick={onSort}/>
                <PlusIcon size={30} className="cursor-pointer" onClick={() => setIsAddOpen(true)}/>
            </div>
            {deck && <AddCardModal open={isAddOpen} onOpenChange={setIsAddOpen} deck={deck}/>}
        </div>
    );
}

export default CardListHeader;