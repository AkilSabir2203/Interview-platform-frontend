// // import api from "../../libs/axois";
// // import { useNavigate } from "react-router-dom";
// // import { FcGoogle} from "react-icons/fc";
// // import { useCallback, useState } from "react";
// // import { useForm } from "react-hook-form";
// // import type { FieldValues, SubmitHandler } from "react-hook-form";

// // import useSignupModal from "../../hooks/useSignupModal";
// // import useLoginModal from "../../hooks/useLoginModal";

// // import { useAuth } from "../AuthProvider";

// // import Modal from "./Modal";
// // import Heading from "../navbar/Heading";
// // import Input from "../inputs/Input";
// // import toast from "react-hot-toast";
// // import Button from "../ui/Button";

// // const LoginModal = () => {
// //     const navigate = useNavigate();

// //     const { loginContextSync } = useAuth();

// //     const signupModal = useSignupModal();
// //     const loginModal = useLoginModal();
// //     const [isLoading, setIsLoading] = useState(false);

// //     const {
// //         register,
// //         handleSubmit,
// //         formState: {
// //             errors,
// //         }
// //     } = useForm<FieldValues>({
// //         defaultValues: {
// //             email: '',
// //             password: ''
// //         }
// //     });

// //     const onSubmit: SubmitHandler<FieldValues> = (data) => {
// //         setIsLoading(true);

// //         api.post('/api/v1/auth/login', data)
// //             .then((response) => {
// //                 toast.success('Logged in successfully!');
                
// //                 // Destructure your synchronized payload parameters matching schemas.AuthResponse exactly
// //                 const { access_token, user } = response.data;
                
// //                 // Commits access_token straight into running React RAM state memory
// //                 loginContextSync(access_token, user); 
                
// //                 navigate("/practice");
// //                 loginModal.onClose();
// //             }) // 💡 FIX: Removed the stray semicolon here that was breaking your compilation chain!
// //             .catch((error) => {
// //                 // Catch FastAPI's default Exception details object payload 
// //                 const errorMsg = error.response?.data?.detail || 'Invalid credentials';
// //                 toast.error(errorMsg);
// //             })
// //             .finally(() => {
// //                 setIsLoading(false); 
// //             });
// //     };

// //     const toggle = useCallback(() => {
// //         loginModal.onClose();
// //         signupModal.onOpen();
// //     }, [loginModal,signupModal]);

// //     const bodyContent = (
// //         <div className="flex flex-col gap-4">
// //             <Heading title="Welcome back" subtitle="Login to your account!" />
// //             <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
// //             <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required/>
// //         </div>
// //     )

// //     const footerContent = (
// //         <div className="flex flex-col gap-4 mt-3">
// //             <hr className="border-neutral-200" />
// //             <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => "http://127.0.0.1:8000/auth/google/login/"}/>
// //             <div className="text-neutral-500 text-center mt-4 font-light">
// //                 <div className="justify-center flex flex-row items-center gap-2">
// //                     <div>
// //                         Don't have an account?
// //                     </div>
// //                     <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">
// //                         Signup
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     )

// //     return (
// //         <Modal disabled={isLoading} isOpen={loginModal.isOpen} title="Login" actionLabel="Continue" onClose={loginModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent}/>
// //     );
// // }

// // export default LoginModal;

// import api from "../../libs/axois";
// import { useNavigate } from "react-router-dom";
// import { FcGoogle} from "react-icons/fc";
// import { useCallback, useState } from "react";
// import { useForm } from "react-hook-form";
// import type { FieldValues, SubmitHandler } from "react-hook-form";

// import useSignupModal from "../../hooks/useSignupModal";
// import useLoginModal from "../../hooks/useLoginModal";
// import { useAuth } from "../AuthProvider";
// import Modal from "./Modal";
// import Heading from "../navbar/Heading";
// import Input from "../inputs/Input";
// import toast from "react-hot-toast";
// import Button from "../ui/Button";

// const LoginModal = () => {
//     const navigate = useNavigate();
//     const { loginContextSync } = useAuth();
//     const signupModal = useSignupModal();
//     const loginModal = useLoginModal();
//     const [isLoading, setIsLoading] = useState(false);

//     // 💡 1. Add state to track the selected role
//     const [role, setRole] = useState<'candidate' | 'interviewer'>('candidate');

//     const {
//         register,
//         handleSubmit,
//         formState: { errors }
//     } = useForm<FieldValues>({
//         defaultValues: { email: '', password: '' }
//     });

//     const onSubmit: SubmitHandler<FieldValues> = (data) => {
//         setIsLoading(true);

//         // 💡 2. Send the selected role so the backend knows which profile to check
//         const payload = {
//             ...data,
//             role: role
//         };

//         api.post('/api/v1/auth/login', payload)
//             .then((response) => {
//                 toast.success('Logged in successfully!');
//                 const { access_token, user } = response.data;
//                 loginContextSync(access_token, user); 
                
//                 // Route based on role
//                 if (user.role === 'interviewer') {
//                     navigate('/auth/onboard-interviewer'); // Update to your interviewer dashboard path later
//                 } else {
//                     navigate('/practice'); 
//                 }
                
//                 loginModal.onClose();
//             })
//             .catch((error) => {
//                 const errorMsg = error.response?.data?.detail || 'Invalid credentials';
//                 toast.error(errorMsg);
//             })
//             .finally(() => {
//                 setIsLoading(false); 
//             });
//     };

//     const toggle = useCallback(() => {
//         loginModal.onClose();
//         signupModal.onOpen();
//     }, [loginModal,signupModal]);

//     const bodyContent = (
//         <div className="flex flex-col gap-4">
//             <Heading title="Welcome back" subtitle="Login to your account!" />
            
//             {/* 💡 3. The Side-by-Side Role Toggle UI */}
//             <div className="flex w-full bg-neutral-100 p-1 rounded-lg">
//                 <button 
//                     type="button"
//                     onClick={() => setRole('candidate')}
//                     className={`w-1/2 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
//                         role === 'candidate' 
//                         ? 'bg-white shadow-sm text-neutral-900 border border-neutral-200' 
//                         : 'text-neutral-500 hover:text-neutral-700'
//                     }`}
//                 >
//                     Candidate
//                 </button>
//                 <button 
//                     type="button"
//                     onClick={() => setRole('interviewer')}
//                     className={`w-1/2 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
//                         role === 'interviewer' 
//                         ? 'bg-white shadow-sm text-neutral-900 border border-neutral-200' 
//                         : 'text-neutral-500 hover:text-neutral-700'
//                     }`}
//                 >
//                     Interviewer
//                 </button>
//             </div>

//             <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
//             <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required/>
//         </div>
//     )

//     const footerContent = (
//         <div className="flex flex-col gap-4 mt-3">
//             <hr className="border-neutral-200" />
//             <Button outline label={"Continue with Google"} icon={FcGoogle} onClick={() => window.location.href = "http://127.0.0.1:8000/auth/google/login/"}/>
//             <div className="text-neutral-500 text-center mt-4 font-light">
//                 <div className="justify-center flex flex-row items-center gap-2">
//                     <div>Don't have an account?</div>
//                     <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">Signup</div>
//                 </div>
//             </div>
//         </div>
//     )

//     return (
//         <Modal disabled={isLoading} isOpen={loginModal.isOpen} title="Login" actionLabel="Continue" onClose={loginModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent}/>
//     );
// }

// export default LoginModal;

import api from "../../libs/axois";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";

import useSignupModal from "../../hooks/useSignupModal";
import useLoginModal from "../../hooks/useLoginModal";
import { useAuth } from "../AuthProvider";
import Modal from "./Modal";
import Heading from "../navbar/Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../ui/Button";

const LoginModal = () => {
    const navigate = useNavigate();
    const { loginContextSync } = useAuth();
    const signupModal = useSignupModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    // Track the selected role context state
    const [role, setRole] = useState<'candidate' | 'interviewer'>('candidate');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FieldValues>({
        defaultValues: { email: '', password: '' }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        const payload = {
            ...data,
            role: role
        };

        // 1. Submit authentication credentials
        api.post('/api/v1/auth/login', payload)
            .then(async (response) => {
                const { access_token, user } = response.data;

                try {
                    // ⚡ THE SENIOR FIX: Catch profile row *immediately* right after authentication success!
                    // This prevents landing on a profile dashboard containing unhydrated empty fallback texts.
                    const profileResponse = await api.post("/api/v1/auth/me", {}, {
                        headers: { Authorization: `Bearer ${access_token}` }
                    });

                    // Commits access_token, user credentials, and the parsed profile object concurrently
                    loginContextSync(access_token, user, profileResponse.data);
                    toast.success('Logged in successfully!');
                    
                    navigate('/practice'); 
                    loginModal.onClose();

                } catch (profileError: any) {
                    // 🔒 403 Onboarding Guard catch boundary pattern
                    if (profileError.response?.status === 403) {
                        // User exists but hasn't filled profile data forms yet
                        loginContextSync(access_token, { ...user, hasCompletedOnboarding: false }, null);
                        toast.success('Authenticated! Please complete onboarding setup layout.');
                        
                        if (user.role === 'interviewer') {
                            navigate('/auth/onboard-interviewer');
                        } else {
                            navigate('/auth/onboard-candidate'); // Change path base mapping context if needed
                        }
                        loginModal.onClose();
                    } else {
                        throw profileError; // Route errors downward to standard interceptors handler
                    }
                }
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.detail || 'Invalid credentials';
                toast.error(errorMsg);
            })
            .finally(() => {
                setIsLoading(false); 
            });
    };

    const toggle = useCallback(() => {
        loginModal.onClose();
        signupModal.onOpen();
    }, [loginModal, signupModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back" subtitle="Login to your account!" />
            
            {/* The Side-by-Side Role Toggle UI */}
            <div className="flex w-full bg-neutral-100 p-1 rounded-lg">
                <button 
                    type="button"
                    onClick={() => setRole('candidate')}
                    className={`w-1/2 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                        role === 'candidate' 
                        ? 'bg-white shadow-sm text-neutral-900 border border-neutral-200' 
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                >
                    Candidate
                </button>
                <button 
                    type="button"
                    onClick={() => setRole('interviewer')}
                    className={`w-1/2 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                        role === 'interviewer' 
                        ? 'bg-white shadow-sm text-neutral-900 border border-neutral-200' 
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                >
                    Interviewer
                </button>
            </div>

            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
            <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required/>
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr className="border-neutral-200" />
            <Button outline label={"Continue with Google"} icon={FcGoogle} onClick={() => window.location.href = "http://127.0.0.1:8000/auth/google/login/"}/>
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>Don't have an account?</div>
                    <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">Signup</div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal disabled={isLoading} isOpen={loginModal.isOpen} title="Login" actionLabel="Continue" onClose={loginModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent}/>
    );
}

export default LoginModal;