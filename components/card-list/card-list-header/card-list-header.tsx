import React, {useState} from 'react';
import {useDeck} from "@/hooks/useDecks";
import {ArrowLeft, PlusIcon} from "lucide-react";
import AddCardModal from "@/components/dashboard/cards/modals/add-card-modal";
import styles from './card-list-header.module.css'
import {useRouter} from "next/navigation";


type CardListHeaderProps = {
    deckId: number;
}

function CardListHeader({deckId}: CardListHeaderProps) {
    const {data: deck} = useDeck(deckId);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const router = useRouter();
    return (
        <div className={styles.cardListHeaderContainer}>
            <p className={styles.cardListHeaderContainerTitle}><ArrowLeft size={30}
                                                                          onClick={() => router.back()}
                                                                          className={'cursor-pointer'}/>{deck?.name}
            </p>
            <PlusIcon size={30} className="cursor-pointer" onClick={() => setIsAddOpen(true)}/>
            {deck && <AddCardModal open={isAddOpen} onOpenChange={setIsAddOpen} deck={deck}/>}
        </div>
    );
}

export default CardListHeader;