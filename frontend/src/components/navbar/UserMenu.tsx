import React, { useCallback, useState, useMemo } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useNavigate } from "react-router";

import Avatar from "../ui/Avatar";
import MenuItem from "./MenuItem";
import useLoginModal from "../../hooks/useLoginModal";
import { useAuth } from "../AuthProvider";

const UserMenu: React.FC = () => {
    const loginModal = useLoginModal();
    const [isOpen, setIsOpen] = useState(false);
    const router = useNavigate();

    // ⚡ Consume both global auth identities and full profile shapes directly from context
    const { currentUser, profile, handleLogout } = useAuth();

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, []);

    const onLogout = useCallback(async () => {
        try {
            await handleLogout(); // Clean out tokens and profile state slices completely
            setIsOpen(false);     // Retract menu dropdown window
            router("/");          // Push browser route safely back to application root landing
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    }, [handleLogout, router]);

    // ⚡ Senior Name Reconstruction Engine
    // Assembles 'firstname lastname' so your custom Avatar component 
    // can automatically parse the first letter of each word to make initials!
    const combinedDisplayName = useMemo(() => {
        if (profile?.firstname) {
            return `${profile.firstname} ${profile.lastname || ""}`.trim();
        }
        // Fall back to system login email tracking identifier if onboarding isn't finalized
        return currentUser?.email || null;
    }, [profile, currentUser?.email]);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div 
                    onClick={toggleOpen} 
                    className="p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition select-none"
                >
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        {/* 🎯 Passes the parsed name. If profile.image is null or empty, 
                            your Avatar automatically handles initials rendering out-of-the-box! */}
                        <Avatar 
                            src={profile?.image} 
                            name={combinedDisplayName} 
                        />
                    </div>
                </div>
            </div>
            
            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-32 bg-white overflow-hidden right-0 top-12 text-sm z-50 border border-neutral-100">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ? (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        router("/profile");
                                        setIsOpen(false); 
                                    }}
                                    label="My Profile"
                                />
                                <hr className="border-neutral-200"/>
                                <MenuItem 
                                    onClick={onLogout} 
                                    label="Log Out"
                                />
                            </>
                        ) : (
                            <>
                                <MenuItem 
                                    onClick={() => {
                                        loginModal.onOpen();
                                        setIsOpen(false);
                                    }} 
                                    label="Log In" 
                                />
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMenu;