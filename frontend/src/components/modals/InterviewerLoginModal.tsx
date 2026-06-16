import axios from "../../libs/axois";
import { useNavigate } from "react-router-dom";
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

const LoginModal = () => {

    const navigate = useNavigate(); 
    const { setAuthData } = useAuth();
    const interviewersignupModal = useSignupModal();
    const interviewerloginModal = useLoginModal();

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

        axios.post('/api/v1/auth/interviwerlogin/', data)
            .then((response) => {
                toast.success('Logged in successfully!');
                
                const token = response.data.authToken || response.data.token;
                const user = response.data.user;
                
                setAuthData(token, user);

                navigate("/");
                interviewerloginModal.onClose();
            })
            .catch((error) => {
                // Safely handle errors (e.g., wrong password)
                toast.error(error.response?.data?.error || 'Invalid credentials');
            })
            .finally(() => {
                // Ensure loading state is turned off whether it succeeds or fails
                setIsLoading(false); 
            });
    }

    const toggle = useCallback(() => {
        interviewerloginModal.onClose();
        interviewersignupModal.onOpen();
    }, [interviewerloginModal,interviewersignupModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back" subtitle="Login to your account!" />
            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required/>
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
                        Don't have an account?
                    </div>
                    <div onClick={toggle} className="text-neutral-800 cursor-pointer hover:underline">
                        Signup
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <Modal disabled={isLoading} isOpen={interviewerloginModal.isOpen} title="Login" actionLabel="Continue" onClose={interviewerloginModal.onClose} onSubmit={handleSubmit(onSubmit)} body={bodyContent} footer={footerContent}/>
    );
}

export default LoginModal;