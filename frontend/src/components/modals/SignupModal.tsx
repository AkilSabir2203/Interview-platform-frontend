// import { useNavigate } from "react-router-dom";
// import api from "../../libs/axois";
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

// const SignupModal = () => {
//     const signupModal = useSignupModal();
//     const loginModal = useLoginModal();

//     const { loginContextSync } = useAuth();

//     const navigate = useNavigate();

//     const [isLoading, setIsLoading] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         formState: {
//             errors,
//         }
//     } = useForm<FieldValues>({
//         defaultValues: {
//             email: '',
//             password: ''
//         }
//     });

//     const onSubmit: SubmitHandler<FieldValues> = (data) => {
//         setIsLoading(true);

//         api.post('/api/v1/auth/register', data) 
//             .then((response) => {
//                 toast.success('Account created successfully!');
                
//                 const { access_token, user } = response.data;
//                 loginContextSync(access_token, user);
                
//                 signupModal.onClose();
                
//                 // 💡 ADD THIS: Push them to the app!
//                 // ProtectedRoute will instantly catch them and redirect to onboarding
//                 navigate('/practice'); 
//             })
//             .catch((error) => {
//                 const errorMsg = error.response?.data?.detail || "Registration failed!";
//                 toast.error(errorMsg);
//             })
//             .finally(() => {
//                 setIsLoading(false);
//             });
//     };

//     const toggle = useCallback(() => {
//         signupModal.onClose();
//         loginModal.onOpen();
//     }, [loginModal,signupModal]);

//     const bodyContent = (
//         <div className="flex flex-col gap-4">
//             <Heading title="Welcome to Amplify" subtitle="Create an account!" />
//             <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
//             <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required/>
//         </div>
//     )

//     const footerContent = (
//         <div className="flex flex-col gap-4 mt-3">
//             <hr className="border-neutral-200" />
//             <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => window.location.href = "http://localhost:8000/auth/google/login/"}/>
//             <div className="text-neutral-500 text-center mt-4 font-light">
//                 <div className="justify-center flex flex-row items-center gap-2">
//                     <div>
//                         Already have an account?
//                     </div>
//                     <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">
//                         Login
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )

//     return (
//         <Modal disabled={isLoading} isOpen={signupModal.isOpen} title="Signup" actionLabel="Continue" onClose={signupModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent}/>
//     );
// }

// export default SignupModal;

import { useNavigate } from "react-router-dom";
import api from "../../libs/axois";
import { FcGoogle} from "react-icons/fc";
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

const SignupModal = () => {
    const signupModal = useSignupModal();
    const loginModal = useLoginModal();
    const { loginContextSync } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
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

        // 💡 2. Inject the selected role into the payload
        const payload = {
            ...data,
            role: role
        };

        api.post('/api/v1/auth/register', payload) 
            .then((response) => {
                toast.success('Account created successfully!');
                const { access_token, user } = response.data;
                loginContextSync(access_token, user);
                signupModal.onClose();
                
                // Route based on role!
                if (user.role && user.role.toUpperCase() === 'INTERVIEWER') {
                    navigate('/auth/onboard-interviewer'); 
                } else {
                    navigate('/practice'); 
                }
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.detail || "Registration failed!";
                toast.error(errorMsg);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const toggle = useCallback(() => {
        signupModal.onClose();
        loginModal.onOpen();
    }, [loginModal,signupModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to Amplify" subtitle="Create an account!" />
            
            {/* 💡 3. The Side-by-Side Role Toggle UI */}
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
            <Button outline label={"Continue with Google"} icon={FcGoogle} onClick={() => window.location.href = "http://localhost:8000/auth/google/login/"}/>
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>Already have an account?</div>
                    <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">Login</div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal disabled={isLoading} isOpen={signupModal.isOpen} title="Signup" actionLabel="Continue" onClose={signupModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent}/>
    );
}

export default SignupModal;