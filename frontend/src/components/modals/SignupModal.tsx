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

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        // 💡 FIX: Adjusted to your explicit FastAPI register route path (No trailing slash!)
        api.post('/api/v1/auth/register', data) 
            .then((response) => {
                toast.success('Account created successfully!');
                
                // Extract structural data from schemas.AuthResponse shape
                const { access_token, user } = response.data;
                
                // Synchronize tokens straight into active state RAM
                loginContextSync(access_token, user);
                
                signupModal.onClose();
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
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
            <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required/>
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr className="border-neutral-200" />
            <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => window.location.href = "http://localhost:8000/auth/google/login/"}/>
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>
                        Already have an account?
                    </div>
                    <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">
                        Login
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal disabled={isLoading} isOpen={signupModal.isOpen} title="Signup" actionLabel="Continue" onClose={signupModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent}/>
    );
}

export default SignupModal;