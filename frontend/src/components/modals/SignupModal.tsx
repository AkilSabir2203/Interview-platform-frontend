"use client";
import axios from "../../libs/axois"
import { FcGoogle} from "react-icons/fc";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import type { FieldValues, SubmitHandler } from "react-hook-form";

import useSignupModal from "../../hooks/useSignupModal";
import useLoginModal from "../../hooks/useLoginModal";

import Modal from "./Modal";
import Heading from "../navbar/Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../ui/Button";

const SignupModal = () => {
    const signupModal = useSignupModal();
    const loginModal = useLoginModal();

    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        // Point this to your Django Signup endpoint
        axios.post('/api/auth/signup/', data) 
        .then(() => {
            toast.success('Signup successful!');
            signupModal.onClose();
            loginModal.onOpen();
        })
        .catch((error) => {
            toast.error(error.response?.data?.detail || 
                        error.response?.data?.error || 
                        "Something went wrong!");
        })
        .finally(() => {
            setIsLoading(false);
        });
    }

    const toggle = useCallback(() => {
        signupModal.onClose();
        loginModal.onOpen();
    }, [loginModal,signupModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome to Amplify" subtitle="Create an account!" />
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
            <Input id="name" label="Name" disabled={isLoading} register={register} errors={errors} required/>
            <Input id="password" type="password" label="Password" disabled={isLoading} register={register} errors={errors} required/>
        </div>
    )

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr className="border-neutral-200" />
            <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => "http://localhost:8000/auth/google/login/"}/>
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