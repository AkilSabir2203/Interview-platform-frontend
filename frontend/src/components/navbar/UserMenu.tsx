import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../ui/Avatar";
import { useCallback, useState } from "react";
import MenuItem from "./MenuItem";

import useLoginModal from "../../hooks/useLoginModal";

import { useAuth } from "../AuthProvider";


import { useNavigate } from "react-router";
import type { User } from "../../types";

interface UserMenuProps {
    currentUser?: User | null;
}

const UserMenu: React.FC<UserMenuProps> = ({
    currentUser
}) => {
    const loginModal = useLoginModal();
    const [isOpen, setIsOpen] = useState(false);
    const router = useNavigate();

    const { handleLogout } = useAuth();

    const toggleOpen = useCallback(() => {
        setIsOpen((value) => !value);
    }, [])

    const onRent = useCallback(() => {
        if(!currentUser) {
            return loginModal.onOpen();
        }

        // rentModal.onOpen();
        // , rentModal
    }, [currentUser, loginModal])

    const onLogout = useCallback(async () => {
        try {
            console.log("logout clicked");
            await handleLogout(); // Triggers context state cleanup
            setIsOpen(false);     // Closes dropdown menu
            router("/");          // Redirects safely back to landing page
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    }, [handleLogout, router]);

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                <div onClick={toggleOpen} className="p-4 md:py-1 md:px-2 border border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
                    <AiOutlineMenu />
                    <div className="hidden md:block">
                        <Avatar src={currentUser?.image}/>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div className="absolute rounded-xl shadow-md w-[40vw] md:w-32 bg-white overflow-hidden right-0 top-12 text-sm">
                    <div className="flex flex-col cursor-pointer">
                        {currentUser ?  (
                        <>
                            <MenuItem
                                onClick={() => {
                                        router("/profile");
                                        setIsOpen(false); // Fixed: Closes menu on navigation
                                    }}
                                label="My Profile"
                            />
                            <hr className="border-neutral-300"/>
                            <MenuItem 
                                onClick={onLogout} 
                                label="Log Out"
                            />
                        </>
                        ) : ( 
                        <>
                        </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserMenu;