"use client";
import React from "react";
import Button, {BUTTON_COLOR, BUTTON_VARIANT} from "@/components/ui/button/button";
import {Trash2} from "lucide-react";
import Spinner from "@/components/ui/spinner/spinner";
import styles from './profile-footer.module.css'
import {useUser} from "@/hooks/useUser";

type Props = {
    onChangePassword: () => void;
    onSetPassword: () => void;
    onDelete: () => void;
    isDeleting?: boolean;
};

export default function ProfileFooter({onChangePassword, onDelete, isDeleting, onSetPassword}: Props) {
    const {user} = useUser();
    return (
        <div className={styles.profileFooter}>
            <Button buttonType={BUTTON_VARIANT.modal} buttonColor={BUTTON_COLOR.orange} style={{width: 250}}
                    onClick={user?.hasPassword ? onChangePassword : onSetPassword}>
                {user?.hasPassword ? "Change password" : "Set password"}
            </Button>
            <Button buttonColor={BUTTON_COLOR.red} buttonType={BUTTON_VARIANT.modal} onClick={onDelete}
                    disabled={isDeleting} style={{width: 50}}>
                {isDeleting ? <Spinner size={18}/> : <Trash2/>}
            </Button>
        </div>
    );
}
