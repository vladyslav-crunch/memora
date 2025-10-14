"use client";
import React, {useEffect, useState} from "react";
import {useUser} from "@/hooks/useUser";
import styles from "./profile-page.module.css";
import {toast} from "sonner";
import {signOut} from "next-auth/react";
import ChangeUsernameModal from "@/components/profile/modals/change-username-modal";
import ChangePasswordModal from "@/components/profile/modals/change-password-modal";
import {ConfirmModal} from "@/components/ui/confirm-modal/confirm-modal";
import ProfileHeader from "@/components/profile/profile-header/profile-header";
import ProfileFooter from "@/components/profile/profile-footer/profile-footer";
import SetPasswordModal from "@/components/profile/modals/set-password-modal";
import Spinner from "@/components/ui/spinner/spinner";

export default function ProfilePage() {
    const {user, isLoading, isError, updateUser, deleteUser, isDeleting, isUpdating} = useUser();
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSetPasswordModalOpen, setIsSetPasswordModalOpen] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setImageUrl(user.image || "");
        }
    }, [user]);

    if (isLoading) return <div className={styles.profileLoading}><Spinner size={60}/></div>;
    if (isError) return <div>Error loading profile.</div>;
    if (!user) return <div>No user found</div>;

    const handleImageUpload = async (newUrl: string) => {
        setImageUrl(newUrl);
        try {
            await updateUser({image: newUrl});
            toast.success("Profile image updated!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save new profile picture.");
        }
    };

    const handleDelete = async () => {
        try {
            await deleteUser();
            toast.success("Account deleted!");
            await signOut({redirectTo: "/sign-in"});
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete account.");
        }
    };

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-4">My Profile</h3>

            <div className={styles.profileContainer}>
                <ProfileHeader
                    name={name}
                    email={user.email}
                    imageUrl={imageUrl}
                    onNameEdit={() => setIsNameModalOpen(true)}
                    onImageUpload={handleImageUpload}
                    isUpdating={isUpdating}
                />

                <ProfileFooter
                    onSetPassword={() => setIsSetPasswordModalOpen(true)}
                    onChangePassword={() => setIsPasswordModalOpen(true)}
                    onDelete={() => setIsDeleteModalOpen(true)}
                    isDeleting={isDeleting}
                />
            </div>
            <SetPasswordModal open={isSetPasswordModalOpen} onOpenChange={setIsSetPasswordModalOpen}/>
            <ChangeUsernameModal open={isNameModalOpen} onOpenChange={setIsNameModalOpen} currentName={user.name}/>
            <ChangePasswordModal open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}/>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDelete}
            />

        </div>
    );
}
