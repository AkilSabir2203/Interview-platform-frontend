import Brand from "./Brand";
import Container from "../ui/Container";
import Button from "../ui/Button";
import NavMenu from "./NavMenu";
import UserMenu from "./UserMenu";

import useSignupModal from "../../hooks/useSignupModal";
import useLoginModal from "../../hooks/useLoginModal";
import { Link } from "react-router";
import { useAuth } from "../AuthProvider";

// const dummyUser = {
//     id: 12345,
//     email: "jane@example.com",
//     firstname: "Akil",
//     lastname: "sabir",
//     image: "https://avatars.githubusercontent.com/u/1?v=4", // A real image URL to test the Avatar
//     emailVerified: null,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
// };

const Navbar = () => {
    const { authToken, currentUser } = useAuth();
    // useAuthStore((state) => state.currentUser);
    const loginModal = useLoginModal();
    const signupModal = useSignupModal();
    return (
        <div className="fixed flex w-full bg-white z-100 shadow-sm border-b border-neutral-100">
            <Container>
                <div className="flex flex-row justify-between items-center h-16">
                    <div className="flex flex-row items-center gap-4">
                        <Brand/>
                        <NavMenu/>
                    </div>
                    <div className="py-4 flex flex-row items-center justify-end gap-2">
                        {authToken && currentUser ? (
                            <UserMenu currentUser={currentUser}/>
                        ) : (
                            <>
                                <Link to="/auth/login"><Button 
                                    onClick={loginModal.onOpen} 
                                    label="Log in" 
                                    textOnly 
                                    className="font-satoshi text-base font-medium whitespace-nowrap"
                                /></Link>
                                <Link to="/auth/signup"><Button 
                                    onClick={signupModal.onOpen} 
                                    label="Sign up" 
                                    className="font-satoshi flex items-center text-base font-medium mx-1 h-12 border-b-2 border-transparent whitespace-nowrap"
                                /></Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    )
}
// flex items-center text-base font-medium mx-2.5 pt-1 h-16 border-b-2 border-transparent whitespace-nowrap

export default Navbar;