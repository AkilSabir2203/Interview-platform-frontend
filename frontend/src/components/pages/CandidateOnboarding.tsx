"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../libs/axois"; // Using your exact path layout
import { useAuth } from "../AuthProvider";
import Button from "../ui/Button";

export default function CandidateOnboarding() {
   const navigate = useNavigate();
   const { authToken, setCurrentUser } = useAuth(); // Assuming your provider can expose setters if needed
   const [step, setStep] = useState(1);
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: {
         name: "",
         phone: "",
         college_email: "",
      },
   });

   // Watch fields to dynamically validate steps before clicking Next
   const watchedName = watch("name");
   const watchedCollegeEmail = watch("college_email");

   // NIT Raipur Domain validation helper matching your FastAPI regex/logic
   const isValidNitrrEmail = (email: string) => {
      const lowerEmail = email.toLowerCase();
      return lowerEmail.endsWith("nitrr.ac.in");
   };

   const nextStep = () => {
      if (step === 1 && (!watchedName || watchedName.trim().length < 2)) {
         toast.error("Please enter a valid name (min 2 characters).");
         return;
      }
      if (step === 2 && (!watchedCollegeEmail || !isValidNitrrEmail(watchedCollegeEmail))) {
         toast.error("A valid NIT Raipur institutional email (.nitrr.ac.in) is required.");
         return;
      }
      setStep((prev) => prev + 1);
   };

   const prevStep = () => setStep((prev) => prev - 1);

   const onSubmit: SubmitHandler<FieldValues> = async (data) => {
      setIsLoading(false);
      setIsLoading(true);

      // Cleans optional phone strings matching backend patterns if empty
      const payload = {
         name: data.name.trim(),
         college_email: data.college_email.trim().toLowerCase(),
         phone: data.phone.trim() === "" ? null : data.phone.trim(),
      };

      try {
         // Submitting to the Candidate Profile Creation route
         const response = await api.post("/api/v1/candidates", payload, {
            headers: { Authorization: `Bearer ${authToken}` }
         });

         toast.success("Profile onboarding complete! Welcome aboard.");
         
         // Update your React RAM auth context with the unified profile state 
         if(setCurrentUser) {
            setCurrentUser(response.data); 
         }

         navigate("/dashboard"); // Redirect directly into secure app shell
      } catch (error: any) {
         const errorMsg = error.response?.data?.detail || "Failed to save profile configuration.";
         toast.error(errorMsg);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col h-screen w-screen font-sans">
         {/* TOP NAVIGATION BAR */}
         <header className="flex items-center justify-between px-8 py-5 border-b border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Step {step} of 3 — Candidate Setup
               </span>
               <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                  {step === 1 && "Let's introduce yourself"}
                  {step === 2 && "Verify Academic Credentials"}
                  {step === 3 && "Finalize Contact Profile"}
               </h1>
            </div>
            
            {/* Elegant Progress Node Ring */}
            <div className="flex items-center gap-2">
               {[1, 2, 3].map((s) => (
                  <div 
                     key={s} 
                     className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                        s <= step ? "bg-indigo-600 w-12" : "bg-neutral-200"
                     }`}
                  />
               ))}
            </div>
         </header>

         {/* CONTENT MAIN BODY VIEWPORT */}
         <main className="flex-1 overflow-y-auto px-6 py-12 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl border border-neutral-200 p-8 md:p-12 shadow-xl">
               
               {/* STEP 1: Basic String Demographics */}
               {step === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">What should we call you?</h2>
                        <p className="text-sm text-neutral-500">Enter your full name as it appears on your official college records.</p>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-neutral-600 uppercase">Full Name</label>
                        <input
                           type="text"
                           disabled={isLoading}
                           placeholder="e.g. Rahul Mishra"
                           className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                              errors.name ? "border-rose-500" : "border-neutral-300"
                           }`}
                           {...register("name", { required: true, minLength: 2, maxLength: 100 })}
                        />
                        {errors.name && <span className="text-xs text-rose-500">Name string requires 2–100 valid characters.</span>}
                     </div>
                  </div>
               )}

               {/* STEP 2: Strict NITRR Validation Domain */}
               {step === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Your College Email Address</h2>
                        <p className="text-sm text-neutral-500">This platform is restricted to active members of NIT Raipur.</p>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-neutral-600 uppercase">Institutional Email Address</label>
                        <input
                           type="email"
                           disabled={isLoading}
                           placeholder="username.id@nitrr.ac.in"
                           className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                              errors.college_email ? "border-rose-500" : "border-neutral-300"
                           }`}
                           {...register("college_email", { 
                              required: true, 
                              validate: (val) => isValidNitrrEmail(val)
                           })}
                        />
                        <p className="text-xs text-neutral-400 mt-1">Must strictly match or terminate with: <strong>@nitrr.ac.in</strong></p>
                        {errors.college_email && (
                           <span className="text-xs text-rose-500">Please provide a structurally approved NITRR campus email domain.</span>
                        )}
                     </div>
                  </div>
               )}

               {/* STEP 3: Optional Mobile Processing */}
               {step === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Contact Details (Optional)</h2>
                        <p className="text-sm text-neutral-500">Add an optional phone index to let interviewers coordinate updates via text pipeline.</p>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-neutral-600 uppercase">Phone Number</label>
                        <input
                           type="tel"
                           disabled={isLoading}
                           placeholder="+919876543210"
                           className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                              errors.phone ? "border-rose-500" : "border-neutral-300"
                           }`}
                           {...register("phone", { 
                              pattern: /^\+?[1-9]\d{1,14}$/
                           })}
                        />
                        {errors.phone && <span className="text-xs text-rose-500">Please supply an E.164 compliant telephone formatting format.</span>}
                     </div>
                  </div>
               )}

            </div>
         </main>

         {/* PERSISTENT FOOTER ACTION PANEL */}
         <footer className="border-t border-neutral-200 bg-white px-8 py-5 flex items-center justify-between shadow-md">
            <div>
               {step > 1 ? (
                  <Button
                     outline
                     disabled={isLoading}
                     label="Back"
                     onClick={prevStep}
                  />
               ) : (
                  <div className="text-xs text-neutral-400 font-medium">Authentication token successfully linked.</div>
               )}
            </div>

            <div className="w-full md:w-auto">
               {step < 3 ? (
                  <Button 
                     label="Next Phase" 
                     onClick={nextStep} 
                  />
               ) : (
                  <Button 
                     disabled={isLoading} 
                     label={isLoading ? "Saving Parameters..." : "Submit & Launch Profiles"} 
                     onClick={handleSubmit(onSubmit)} 
                  />
               )}
            </div>
         </footer>
      </div>
   );
}