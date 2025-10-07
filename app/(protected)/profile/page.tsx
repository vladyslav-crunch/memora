"use client";

import React, {useState, useEffect} from "react";
import {useUser} from "@/hooks/useUser";
import {
    CldUploadWidget,
    CldImage,
    CloudinaryUploadWidgetInfo,
} from "next-cloudinary";
import Image from "next/image";

export default function Page() {
    const {
        user,
        stats,
        isLoading,
        isError,
        updateUser,
        isUpdating,
        changePassword,
        isChangingPassword,
        deleteUser,
        isDeleting,
    } = useUser();

    const [name, setName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setImageUrl(user.image || "");
        }
    }, [user]);

    if (isLoading) return <div>Loading profile...</div>;
    if (isError) return <div>Error loading profile.</div>;
    if (!user) return <div>No user found</div>;

    // --- Handle Save (name + image) ---
    const handleSave = async () => {
        try {
            await updateUser({
                name,
                image: imageUrl,
            });
            alert("Profile saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to save profile changes.");
        }
    };

    const handlePasswordChange = async () => {
        try {
            await changePassword({currentPassword, newPassword});
            alert("Password changed!");
            setCurrentPassword("");
            setNewPassword("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete your account?")) return;
        try {
            await deleteUser();
            alert("Account deleted!");
        } catch (err) {
            alert("Failed to delete account");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg space-y-6">
            <h1 className="text-xl font-semibold">My Profile</h1>

            {/* --- Profile Image Upload --- */}
            <div className="flex flex-col items-center space-y-3">
                {imageUrl ? (
                    imageUrl.includes("res.cloudinary.com") ? (
                        <CldImage
                            src={imageUrl}
                            width="128"
                            height="128"
                            crop="fill"
                            alt="Profile Picture"
                            className="rounded-full border"
                        />
                    ) : (
                        <Image
                            src={imageUrl}
                            width={128}
                            height={128}
                            alt="Profile Picture"
                            className="rounded-full border"
                        />
                    )
                ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 border rounded-full">
                        No Image
                    </div>
                )}

                <CldUploadWidget
                    uploadPreset="profile_picture"
                    options={{
                        folder: "profile_pictures",
                        cropping: true,
                        croppingAspectRatio: 1,
                        sources: ["local"],
                    }}
                    onSuccess={(result) => {
                        if (result && typeof result.info !== "string") {
                            const info = result.info as CloudinaryUploadWidgetInfo;
                            setImageUrl(info.secure_url || info.url);
                        }
                    }}
                >
                    {({open}) => (
                        <button
                            type="button"
                            onClick={() => open()}
                            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Change Image
                        </button>
                    )}
                </CldUploadWidget>
            </div>

            {/* --- Name & Email --- */}
            <div className="space-y-2">
                <label className="block text-sm font-medium">Email:</label>
                <p className="text-gray-700">{user.email}</p>

                <label className="block text-sm font-medium mt-4">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
            </div>

            {/* --- Save Button --- */}
            <button
                onClick={handleSave}
                disabled={isUpdating}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {isUpdating ? "Saving..." : "Save Changes"}
            </button>

            {/* --- Password Change --- */}
            <div className="space-y-2 border-t pt-4">
                <h2 className="text-lg font-medium">Change Password</h2>
                <input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
                <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                />
                <button
                    onClick={handlePasswordChange}
                    disabled={isChangingPassword}
                    className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
                >
                    {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
            </div>

            {/* --- Delete Account --- */}
            <div className="border-t pt-4">
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
                >
                    {isDeleting ? "Deleting..." : "Delete Account"}
                </button>
            </div>

            {/* --- Stats --- */}
            {stats && (
                <div className="border-t pt-4 text-sm text-gray-700">
                    <h2 className="font-medium mb-2">Statistics</h2>
                    <p>Total Decks: {stats.totalDecks}</p>
                    <p>Total Cards: {stats.totalCards}</p>
                </div>
            )}
        </div>
    );
}
