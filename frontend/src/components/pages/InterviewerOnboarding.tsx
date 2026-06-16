"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, type FieldValues, useFieldArray } from "react-hook-form";
import { IoMdAdd, IoMdTrash } from "react-icons/io";
import toast from "react-hot-toast";
import api from "../../libs/axois";
import { useAuth } from "../AuthProvider";
import Button from "../ui/Button";

export default function InterviewerOnboarding() {
   const navigate = useNavigate();
   const { authToken, setCurrentUser } = useAuth();
   const [step, setStep] = useState(1);
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      control,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: {
         name: "",
         phone: "",
         company: "",
         position: "",
         profile_image_url: "",
         skills: [{ value: "" }] // Starts with one empty input field for skills
      },
   });

   // Handles dynamic list rendering for your skills array mapping
   const { fields, append, remove } = useFieldArray({
      control,
      name: "skills",
   });

   // Watch current step inputs for validation guards
   const watchedName = watch("name");
   const watchedCompany = watch("company");
   const watchedPosition = watch("position");
   const watchedSkills = watch("skills");

   const nextStep = () => {
      if (step === 1 && (!watchedName || watchedName.trim().length < 2)) {
         toast.error("Please enter your name (min 2 characters).");
         return;
      }
      if (step === 2 && ((!watchedCompany || watchedCompany.trim().length < 2) || (!watchedPosition || watchedPosition.trim().length < 2))) {
         toast.error("Company and Position are required parameters.");
         return;
      }
      if (step === 3) {
         // Validates Pydantic's min_length=1 constraint on the skills list
         const validSkillsCount = watchedSkills.filter((s: any) => s.value.trim() !== "").length;
         if (validSkillsCount < 1) {
            toast.error("You must add at least one professional skill trait.");
            return;
         }
      }
      setStep((prev) => prev + 1);
   };

   const prevStep = () => setStep((prev) => prev - 1);

   const onSubmit: SubmitHandler<FieldValues> = async (data) => {
      setIsLoading(true);

      // Clean skill arrays into simple string elements matching backend schema list[TrimmedSkill]
      const cleanedSkills = data.skills
         .map((s: any) => s.value.trim())
         .filter((val: string) => val !== "");

      const payload = {
         name: data.name.trim(),
         company: data.company.trim(),
         position: data.position.trim(),
         skills: cleanedSkills,
         phone: data.phone.trim() === "" ? null : data.phone.trim(),
         profile_image_url: data.profile_image_url.trim() === "" ? null : data.profile_image_url.trim(),
      };

      try {
         const response = await api.post("/api/v1/interviewers", payload, {
            headers: { Authorization: `Bearer ${authToken}` }
         });

         toast.success("Interviewer workspace loaded successfully!");
         
         if (setCurrentUser) {
            setCurrentUser(response.data);
         }

         navigate("/dashboard");
      } catch (error: any) {
         const errorMsg = error.response?.data?.detail || "Failed to set up recruiter profile.";
         toast.error(errorMsg);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col h-screen w-screen font-sans">
         {/* HEADER PROFILE TRACKER */}
         <header className="flex items-center justify-between px-8 py-5 border-b border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                  Step {step} of 4 — Interviewer Setup
               </span>
               <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                  {step === 1 && "Personal Information"}
                  {step === 2 && "Corporate Profile"}
                  {step === 3 && "Define Core Evaluation Stacks"}
                  {step === 4 && "Finalize Digital Profile"}
               </h1>
            </div>
            
            <div className="flex items-center gap-2">
               {[1, 2, 3, 4].map((s) => (
                  <div 
                     key={s} 
                     className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                        s <= step ? "bg-emerald-600 w-12" : "bg-neutral-200"
                     }`}
                  />
               ))}
            </div>
         </header>

         {/* MAIN INTERACTIVE FORMS VIEW */}
         <main className="flex-1 overflow-y-auto px-6 py-12 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-white rounded-2xl border border-neutral-200 p-8 md:p-12 shadow-xl">
               
               {/* STEP 1: Basic Bio Details */}
               {step === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Welcome! What is your name?</h2>
                        <p className="text-sm text-neutral-500">Your full profile credentials will appear on evaluations shared with team members.</p>
                     </div>
                     <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">Full Name</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="e.g. Dr. Anand Sabir"
                              className="w-full p-4 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                              {...register("name", { required: true, minLength: 2, maxLength: 100 })}
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">Contact Number (Optional)</label>
                           <input
                              type="tel"
                              disabled={isLoading}
                              placeholder="+919876543210"
                              className="w-full p-4 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                              {...register("phone", { pattern: /^\+?[1-9]\d{1,14}$/ })}
                           />
                        </div>
                     </div>
                  </div>
               )}

               {/* STEP 2: Work Parameters */}
               {step === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Employment Context</h2>
                        <p className="text-sm text-neutral-500">Provide details about your current enterprise work profile.</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">Company / Organization</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="e.g. Google, Atlassian"
                              className="w-full p-4 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                              {...register("company", { required: true, minLength: 2 })}
                           />
                        </div>
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">Professional Designation</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="e.g. Senior Backend Engineer"
                              className="w-full p-4 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                              {...register("position", { required: true, minLength: 2 })}
                           />
                        </div>
                     </div>
                  </div>
               )}

               {/* STEP 3: Dynamic array rendering for Skills */}
               {step === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Target Tech-Stacks Evaluated</h2>
                        <p className="text-sm text-neutral-500">List the core skills you track. At least 1 technical stack parameter is mandatory.</p>
                     </div>

                     <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {fields.map((field, index) => (
                           <div key={field.id} className="flex items-center gap-3">
                              <input
                                 type="text"
                                 disabled={isLoading}
                                 placeholder="e.g. Node.js, FastApi, Redis, C++"
                                 className="flex-1 p-3 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                                 {...register(`skills.${index}.value` as const, { required: true })}
                              />
                              {fields.length > 1 && (
                                 <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-3 border border-rose-200 text-rose-500 rounded-xl hover:bg-rose-50 transition"
                                 >
                                    <IoMdTrash size={20} />
                                 </button>
                              )}
                           </div>
                        ))}
                     </div>

                     <button
                        type="button"
                        onClick={() => append({ value: "" })}
                        className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition"
                     >
                        <IoMdAdd size={18} /> Add Competency Skill Variant
                     </button>
                  </div>
               )}

               {/* STEP 4: Optional Profile Avatar URL */}
               {step === 4 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Profile Image Configuration</h2>
                        <p className="text-sm text-neutral-500">Provide an optional profile picture asset URL to populate your team directory identifier.</p>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-neutral-600 uppercase">Profile Picture URL</label>
                        <input
                           type="url"
                           disabled={isLoading}
                           placeholder="https://example.com/avatar.jpg"
                           className="w-full p-4 border border-neutral-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition"
                           {...register("profile_image_url")}
                        />
                     </div>
                  </div>
               )}

            </div>
         </main>

         {/* PERSISTENT ACTIONS FOOTER PANEL */}
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
                  <div className="text-xs text-neutral-400 font-medium">Recruiter account shell verified.</div>
               )}
            </div>

            <div className="w-full md:w-auto">
               {step < 4 ? (
                  <Button 
                     label="Next Phase" 
                     onClick={nextStep} 
                  />
               ) : (
                  <Button 
                     disabled={isLoading} 
                     label={isLoading ? "Generating Workspace..." : "Complete Setup"} 
                     onClick={handleSubmit(onSubmit)} 
                  />
               )}
            </div>
         </footer>
      </div>
   );
}