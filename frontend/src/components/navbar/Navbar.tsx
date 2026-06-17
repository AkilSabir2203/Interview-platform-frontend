import { useLocation, Link } from "react-router-dom";
import Brand from "./Brand";
import Container from "../ui/Container";
import Button from "../ui/Button";
import NavMenu from "./NavMenu";
import UserMenu from "./UserMenu";

import useSignupModal from "../../hooks/useSignupModal";
import useLoginModal from "../../hooks/useLoginModal";
import { useAuth } from "../AuthProvider";

const Navbar = () => {
    const { authToken, currentUser } = useAuth();
    const loginModal = useLoginModal();
    const signupModal = useSignupModal();
    
    // 1. Get the current route location
    const location = useLocation();

    // 2. Check if the user is currently on an onboarding page
    const isOnboarding = location.pathname.includes('/onboard');

    return (
        <div className="fixed flex w-full bg-white z-100 shadow-sm border-b border-neutral-100">
            <Container>
                <div className="flex flex-row justify-between items-center h-16">
                    
                    {/* LEFT SIDE: Brand & NavMenu */}
                    <div className="flex flex-row items-center gap-4">
                        <Brand disableLink={isOnboarding}/>
                        {/* 💡 Only show the NavMenu if NOT onboarding */}
                        {!isOnboarding && <NavMenu/>}
                    </div>

                    {/* RIGHT SIDE: Auth Buttons & User Menu */}
                    {/* 💡 Only show the right-side controls if NOT onboarding */}
                    {!isOnboarding && (
                        <div className="py-4 flex flex-row items-center justify-end gap-2">
                            {authToken && currentUser ? (
                                <UserMenu currentUser={currentUser}/>
                            ) : (
                                <>
                                    <Link to="/auth/login">
                                        <Button 
                                            onClick={loginModal.onOpen} 
                                            label="Log in" 
                                            textOnly 
                                            className="font-satoshi text-base font-medium whitespace-nowrap"
                                        />
                                    </Link>
                                    <Link to="/auth/signup">
                                        <Button 
                                            onClick={signupModal.onOpen} 
                                            label="Sign up" 
                                            className="font-satoshi flex items-center text-base font-medium mx-1 h-12 border-b-2 border-transparent whitespace-nowrap"
                                        />
                                    </Link>
                                </>
                            )}
                        </div>
                    )}
                    
                </div>
            </Container>
        </div>
    )
}

export default Navbar;