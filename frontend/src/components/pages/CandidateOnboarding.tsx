// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
// // import toast from "react-hot-toast";
// // import api from "../../libs/axois"; 
// // import { useAuth } from "../AuthProvider";
// // import Button from "../ui/Button";

// // export default function CandidateOnboarding() {
// //    const navigate = useNavigate();
// //    const { authToken, currentUser, loginContextSync } = useAuth(); 
   
// //    const [step, setStep] = useState(1);
// //    const [isLoading, setIsLoading] = useState(false);

// //    const {
// //       register,
// //       handleSubmit,
// //       watch,
// //       formState: { errors },
// //    } = useForm<FieldValues>({
// //       defaultValues: {
// //          firstName: "", // 💡 Changed from name to firstName
// //          lastName: "",  // 💡 Added lastName
// //          phone: "",
// //          college_email: "",
// //       },
// //    });

// //    const watchedFirstName = watch("firstName"); // 💡 Only need to watch firstName for validation
// //    const watchedCollegeEmail = watch("college_email");

// //    const isValidNitrrEmail = (email: string) => {
// //       const lowerEmail = email.toLowerCase();
// //       return lowerEmail.endsWith("nitrr.ac.in");
// //    };

// //    const nextStep = () => {
// //       // 💡 Validate only the first name
// //       if (step === 1 && (!watchedFirstName || watchedFirstName.trim().length < 2)) {
// //          toast.error("Please enter a valid first name (min 2 characters).");
// //          return;
// //       }
// //       if (step === 2 && (!watchedCollegeEmail || !isValidNitrrEmail(watchedCollegeEmail))) {
// //          toast.error("A valid NIT Raipur institutional email (.nitrr.ac.in) is required.");
// //          return;
// //       }
// //       setStep((prev) => prev + 1);
// //    };

// //    const prevStep = () => setStep((prev) => prev - 1);

// //    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
// //       setIsLoading(true);

// //       // 💡 Combine the names safely
// //       const fName = data.firstName.trim();
// //       const lName = data.lastName ? data.lastName.trim() : "";
// //       const combinedName = lName ? `${fName} ${lName}` : fName;

// //       const payload = {
// //          name: combinedName, // 💡 Backend still receives a single 'name' string
// //          college_email: data.college_email.trim().toLowerCase(),
// //          phone: data.phone.trim() === "" ? null : data.phone.trim(),
// //       };

// //       try {
// //          await api.post("/api/v1/auth/onboard-candidate", payload, {
// //             headers: { Authorization: `Bearer ${authToken}` }
// //          });

// //          toast.success("Profile onboarding complete! Welcome aboard.");
         
// //          if (authToken && currentUser) {
// //              const updatedUser = {
// //                  ...currentUser,
// //                  hasCompletedOnboarding: true 
// //              };
             
// //              loginContextSync(authToken, updatedUser); 
// //          }

// //          setTimeout(() => {
// //              navigate("/practice"); 
// //          }, 50);

// //       } catch (error: any) {
// //          const errorMsg = error.response?.data?.detail || "Failed to save profile configuration.";
// //          toast.error(errorMsg);
// //       } finally {
// //          setIsLoading(false);
// //       }
// //    };

// //    return (
// //       <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col h-screen w-screen font-sans">
// //          <header className="flex items-center justify-between px-8 pt-20 py-5 border-b border-neutral-200 bg-white shadow-sm">
// //             <div className="flex flex-col">
// //                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
// //                   Step {step} of 3 — onboarding
// //                </span>
// //                <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
// //                   {step === 1 && "Let's introduce yourself"}
// //                   {step === 2 && "Verify Academic Credentials"}
// //                   {step === 3 && "Finalize Contact Profile"}
// //                </h1>
// //             </div>
            
// //             <div className="flex items-center gap-2">
// //                {[1, 2, 3].map((s) => (
// //                   <div 
// //                      key={s} 
// //                      className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
// //                         s <= step ? "bg-purple-600 w-12" : "bg-neutral-200"
// //                      }`}
// //                   />
// //                ))}
// //             </div>
// //          </header>

// //          <main className="flex-1 overflow-y-auto px-6 py-12 flex justify-center items-center">
// //             <div className="w-full max-w-2xl bg-white rounded-2xl border border-neutral-200 p-8 md:p-12 shadow-xl">
               
// //                {step === 1 && (
// //                   <div className="space-y-6 animate-fadeIn">
// //                      <div className="space-y-2">
// //                         <h2 className="text-lg font-bold text-neutral-800">What should we call you?</h2>
// //                         <p className="text-sm text-neutral-500">Enter your name as it appears on your official college records.</p>
// //                      </div>
                     
// //                      {/* 💡 Split into a two-column grid for First and Last name */}
// //                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                         <div className="flex flex-col gap-2">
// //                            <label className="text-xs font-semibold text-neutral-600 uppercase">First Name *</label>
// //                            <input
// //                               type="text"
// //                               disabled={isLoading}
// //                               placeholder="Akil"
// //                               className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
// //                                  errors.firstName ? "border-rose-500" : "border-neutral-300"
// //                               }`}
// //                               {...register("firstName", { required: true, minLength: 2, maxLength: 50 })}
// //                            />
// //                            {errors.firstName && <span className="text-xs text-rose-500">First name requires 2+ characters.</span>}
// //                         </div>

// //                         <div className="flex flex-col gap-2">
// //                            <label className="text-xs font-semibold text-neutral-600 uppercase">Last Name</label>
// //                            <input
// //                               type="text"
// //                               disabled={isLoading}
// //                               placeholder="Sabir"
// //                               className="w-full p-4 border rounded-xl border-neutral-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
// //                               {...register("lastName", { maxLength: 50 })}
// //                            />
// //                         </div>
// //                      </div>
// //                   </div>
// //                )}

// //                {step === 2 && (
// //                   <div className="space-y-6 animate-fadeIn">
// //                      <div className="space-y-2">
// //                         <h2 className="text-lg font-bold text-neutral-800">Your College Email Address</h2>
// //                         <p className="text-sm text-neutral-500">This platform is restricted to active members of NIT Raipur.</p>
// //                      </div>
// //                      <div className="flex flex-col gap-2">
// //                         <label className="text-xs font-semibold text-neutral-600 uppercase">Institutional Email Address</label>
// //                         <input
// //                            type="email"
// //                            disabled={isLoading}
// //                            placeholder="username.id@nitrr.ac.in"
// //                            className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
// //                               errors.college_email ? "border-rose-500" : "border-neutral-300"
// //                            }`}
// //                            {...register("college_email", { 
// //                               required: true, 
// //                               validate: (val) => isValidNitrrEmail(val)
// //                            })}
// //                         />
// //                         <p className="text-xs text-neutral-400 mt-1">Must strictly match or terminate with: <strong>@nitrr.ac.in</strong></p>
// //                         {errors.college_email && (
// //                            <span className="text-xs text-rose-500">Please provide a structurally approved NITRR campus email domain.</span>
// //                         )}
// //                      </div>
// //                   </div>
// //                )}

// //                {step === 3 && (
// //                   <div className="space-y-6 animate-fadeIn">
// //                      <div className="space-y-2">
// //                         <h2 className="text-lg font-bold text-neutral-800">Contact Details (Optional)</h2>
// //                         <p className="text-sm text-neutral-500">Add an optional phone index to let interviewers coordinate updates via text pipeline.</p>
// //                      </div>
// //                      <div className="flex flex-col gap-2">
// //                         <label className="text-xs font-semibold text-neutral-600 uppercase">Phone Number</label>
// //                         <input
// //                            type="tel"
// //                            disabled={isLoading}
// //                            placeholder="+919876543210"
// //                            className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
// //                               errors.phone ? "border-rose-500" : "border-neutral-300"
// //                            }`}
// //                            {...register("phone", { 
// //                               pattern: /^\+?[1-9]\d{1,14}$/
// //                            })}
// //                         />
// //                         {errors.phone && <span className="text-xs text-rose-500">Please supply an E.164 compliant telephone formatting format.</span>}
// //                      </div>
// //                   </div>
// //                )}

// //             </div>
// //          </main>

// //          <footer className="border-t border-neutral-200 bg-white px-8 py-5 flex items-center justify-between shadow-md">
// //             <div>
// //                {step > 1 ? (
// //                   <Button
// //                      outline
// //                      disabled={isLoading}
// //                      label="Back"
// //                      onClick={prevStep}
// //                   />
// //                ) : (
// //                   <div className="text-xs text-neutral-400 font-medium">This only takes few seconds.</div>
// //                )}
// //             </div>

// //             <div className="w-full md:w-auto">
// //                {step < 3 ? (
// //                   <Button 
// //                      label="Next" 
// //                      onClick={nextStep} 
// //                   />
// //                ) : (
// //                   <Button 
// //                      disabled={isLoading} 
// //                      label={isLoading ? "Saving..." : "Continue"} 
// //                      onClick={handleSubmit(onSubmit)} 
// //                   />
// //                )}
// //             </div>
// //          </footer>
// //       </div>
// //    );
// // }

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
// import toast from "react-hot-toast";
// import api from "../../libs/axois"; 
// import { useAuth } from "../AuthProvider";
// import Button from "../ui/Button";

// export default function CandidateOnboarding() {
//    const navigate = useNavigate();
//    const { authToken, currentUser, loginContextSync } = useAuth(); 
   
//    const [step, setStep] = useState(1);
//    const [isLoading, setIsLoading] = useState(false);

//    const {
//       register,
//       handleSubmit,
//       watch,
//       formState: { errors },
//    } = useForm<FieldValues>({
//       defaultValues: {
//          firstName: "", 
//          lastName: "",  
//          phone: "",
//          college_email: "",
//       },
//    });

//    const watchedFirstName = watch("firstName"); 
//    const watchedCollegeEmail = watch("college_email");

//    const isValidNitrrEmail = (email: string) => {
//       const lowerEmail = email.toLowerCase();
//       return lowerEmail.endsWith("nitrr.ac.in");
//    };

//    const nextStep = () => {
//       if (step === 1 && (!watchedFirstName || watchedFirstName.trim().length < 2)) {
//          toast.error("Please enter a valid first name (min 2 characters).");
//          return;
//       }
//       if (step === 2 && (!watchedCollegeEmail || !isValidNitrrEmail(watchedCollegeEmail))) {
//          toast.error("A valid NIT Raipur institutional email (.nitrr.ac.in) is required.");
//          return;
//       }
//       setStep((prev) => prev + 1);
//    };

//    const prevStep = () => setStep((prev) => prev - 1);

//    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
//       setIsLoading(true);

//       const fName = data.firstName.trim();
//       const lName = data.lastName ? data.lastName.trim() : "";
//       const combinedName = lName ? `${fName} ${lName}` : fName;

//       const payload = {
//          name: combinedName, 
//          college_email: data.college_email.trim().toLowerCase(),
//          phone: data.phone.trim() === "" ? null : data.phone.trim(),
//       };

//       try {
//          // 1. Persist candidate table values to PostgreSQL database
//          await api.post("/api/v1/auth/onboard-candidate", payload, {
//             headers: { Authorization: `Bearer ${authToken}` }
//          });

//          toast.success("Profile onboarding complete! Welcome aboard.");
         
//          // 2. CRITICAL SENIOR FIX: Explicitly break the router lockdown in-memory cache
//          if (authToken && currentUser) {
//              currentUser.hasCompletedOnboarding = true; // Invalidate current reference immediately

//              const updatedUser = {
//                  ...currentUser,
//                  hasCompletedOnboarding: true 
//              };
             
//              loginContextSync(authToken, updatedUser); // Sync global memory state
//          }

//          // 3. CORRECTED PATHWAY: Route to /profile instead of stalling at /practice
//          setTimeout(() => {
//              navigate("/profile"); 
//          }, 50);

//       } catch (error: any) {
//          const errorMsg = error.response?.data?.detail || "Failed to save profile configuration.";
//          toast.error(errorMsg);
//       } finally {
//          setIsLoading(false);
//       }
//    };

//    return (
//       <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col h-screen w-screen font-sans select-none">
//          <header className="flex items-center justify-between px-8 pt-20 py-5 border-b border-neutral-200 bg-white shadow-sm">
//             <div className="flex flex-col">
//                <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
//                   Step {step} of 3 — onboarding
//                </span>
//                <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
//                   {step === 1 && "Let's introduce yourself"}
//                   {step === 2 && "Verify Academic Credentials"}
//                   {step === 3 && "Finalize Contact Profile"}
//                </h1>
//             </div>
            
//             <div className="flex items-center gap-2">
//                {[1, 2, 3].map((s) => (
//                   <div 
//                      key={s} 
//                      className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
//                         s <= step ? "bg-purple-600 w-12" : "bg-neutral-200"
//                      }`}
//                   />
//                ))}
//             </div>
//          </header>

//          <main className="flex-1 overflow-y-auto px-6 py-12 flex justify-center items-center">
//             <div className="w-full max-w-2xl bg-white rounded-2xl border border-neutral-200 p-8 md:p-12 shadow-xl">
               
//                {step === 1 && (
//                   <div className="space-y-6 animate-fadeIn">
//                      <div className="space-y-2">
//                         <h2 className="text-lg font-bold text-neutral-800">What should we call you?</h2>
//                         <p className="text-sm text-neutral-500">Enter your name as it appears on your official college records.</p>
//                      </div>
                     
//                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="flex flex-col gap-2">
//                            <label className="text-xs font-semibold text-neutral-600 uppercase">First Name *</label>
//                            <input
//                               type="text"
//                               disabled={isLoading}
//                               placeholder="Akil"
//                               className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
//                                  errors.firstName ? "border-rose-500" : "border-neutral-300"
//                               }`}
//                               {...register("firstName", { required: true, minLength: 2, maxLength: 50 })}
//                            />
//                            {errors.firstName && <span className="text-xs text-rose-500">First name requires 2+ characters.</span>}
//                         </div>

//                         <div className="flex flex-col gap-2">
//                            <label className="text-xs font-semibold text-neutral-600 uppercase">Last Name</label>
//                            <input
//                               type="text"
//                               disabled={isLoading}
//                               placeholder="Sabir"
//                               className="w-full p-4 border rounded-xl border-neutral-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
//                               {...register("lastName", { maxLength: 50 })}
//                            />
//                         </div>
//                      </div>
//                   </div>
//                )}

//                {step === 2 && (
//                   <div className="space-y-6 animate-fadeIn">
//                      <div className="space-y-2">
//                         <h2 className="text-lg font-bold text-neutral-800">Your College Email Address</h2>
//                         <p className="text-sm text-neutral-500">This platform is restricted to active members of NIT Raipur.</p>
//                      </div>
//                      <div className="flex flex-col gap-2">
//                         <label className="text-xs font-semibold text-neutral-600 uppercase">Institutional Email Address</label>
//                         <input
//                            type="email"
//                            disabled={isLoading}
//                            placeholder="username.id@nitrr.ac.in"
//                            className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
//                               errors.college_email ? "border-rose-500" : "border-neutral-300"
//                            }`}
//                            {...register("college_email", { 
//                               required: true, 
//                               validate: (val) => isValidNitrrEmail(val)
//                            })}
//                         />
//                         <p className="text-xs text-neutral-400 mt-1">Must strictly match or terminate with: <strong>@nitrr.ac.in</strong></p>
//                         {errors.college_email && (
//                            <span className="text-xs text-rose-500">Please provide a structurally approved NITRR campus email domain.</span>
//                         )}
//                      </div>
//                   </div>
//                )}

//                {step === 3 && (
//                   <div className="space-y-6 animate-fadeIn">
//                      <div className="space-y-2">
//                         <h2 className="text-lg font-bold text-neutral-800">Contact Details (Optional)</h2>
//                         <p className="text-sm text-neutral-500">Add an optional phone index to let interviewers coordinate updates via text pipeline.</p>
//                      </div>
//                      <div className="flex flex-col gap-2">
//                         <label className="text-xs font-semibold text-neutral-600 uppercase">Phone Number</label>
//                         <input
//                            type="tel"
//                            disabled={isLoading}
//                            placeholder="+919876543210"
//                            className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
//                               errors.phone ? "border-rose-500" : "border-neutral-300"
//                            }`}
//                            {...register("phone", { 
//                               pattern: /^\+?[1-9]\d{1,14}$/
//                            })}
//                         />
//                         {errors.phone && <span className="text-xs text-rose-500">Please supply an E.164 compliant telephone formatting format.</span>}
//                      </div>
//                   </div>
//                )}

//             </div>
//          </main>

//          <footer className="border-t border-neutral-200 bg-white px-8 py-5 flex items-center justify-between shadow-md">
//             <div>
//                {step > 1 ? (
//                   <Button
//                      outline
//                      disabled={isLoading}
//                      label="Back"
//                      onClick={prevStep}
//                   />
//                ) : (
//                   <div className="text-xs text-neutral-400 font-medium">This only takes few seconds.</div>
//                )}
//             </div>

//             <div className="w-full md:w-auto">
//                {step < 3 ? (
//                   <Button 
//                      label="Next" 
//                      onClick={nextStep} 
//                   />
//                ) : (
//                   <Button 
//                      disabled={isLoading} 
//                      label={isLoading ? "Saving..." : "Continue"} 
//                      onClick={handleSubmit(onSubmit)} 
//                   />
//                )}
//             </div>
//          </footer>
//       </div>
//    );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../libs/axois"; 
import { useAuth } from "../AuthProvider";
import Button from "../ui/Button";

export default function CandidateOnboarding() {
   const navigate = useNavigate();
   const { authToken, currentUser, loginContextSync } = useAuth(); 
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: {
         firstName: "", 
         lastName: "",  
         phone: "",
         college_email: "",
      },
   });

   const isValidNitrrEmail = (email: string) => {
      const lowerEmail = email.toLowerCase();
      return lowerEmail.endsWith("nitrr.ac.in");
   };

   const onSubmit: SubmitHandler<FieldValues> = async (data) => {
      setIsLoading(true);

      const fName = data.firstName.trim();
      const lName = data.lastName ? data.lastName.trim() : "";
      const combinedName = lName ? `${fName} ${lName}` : fName;

      const payload = {
         name: combinedName, 
         college_email: data.college_email.trim().toLowerCase(),
         phone: data.phone.trim() === "" ? null : data.phone.trim(),
      };

      try {
         // 1. Persist candidate values directly to the backend database
         await api.post("/api/v1/auth/onboard-candidate", payload, {
            headers: { Authorization: `Bearer ${authToken}` }
         });

         toast.success("Profile onboarding complete! Welcome aboard.");
         
         // 2. Synchronize memory state data caches 
         if (authToken && currentUser) {
             const updatedUser = {
                 ...currentUser,
                 hasCompletedOnboarding: true 
             };
             
             // Immediate hydration layer reconstruction
             const mockProfileData = {
                 id: currentUser.id,
                 user_id: currentUser.id,
                 name: combinedName,
                 college_email: payload.college_email,
                 phone: payload.phone,
                 role: currentUser.role
             };

             loginContextSync(authToken, updatedUser, mockProfileData); 
         }

         // 3. Clear view bounds and redirect safely to user profile workspace dashboard
         setTimeout(() => {
             navigate("/profile"); 
         }, 50);

      } catch (error: any) {
         const errorMsg = error.response?.data?.detail || "Failed to save profile configuration.";
         toast.error(errorMsg);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col h-screen w-screen font-sans select-none overflow-y-auto">
         <header className="flex items-center justify-between px-8 pt-20 py-5 border-b border-neutral-200 bg-white shadow-sm shrink-0">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-purple-600 uppercase tracking-widest">
                  Onboarding
               </span>
               <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                  Set Up Your Profile
               </h1>
            </div>
         </header>

         <main className="flex-1 px-6 py-12 flex justify-center items-center min-h-fit">
            <div className="w-full max-w-2xl bg-white rounded-2xl border border-neutral-200 p-8 md:p-12 shadow-xl my-auto">
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-fadeIn">
                  
                  {/* Section A: Identity fields */}
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <h2 className="text-base font-bold text-neutral-800">1. Personal Information</h2>
                        <p className="text-xs text-neutral-500">Enter your official metadata properties as recognized on-campus.</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">First Name *</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="Akil"
                              className={`w-full p-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition text-sm ${
                                 errors.firstName ? "border-rose-500" : "border-neutral-300"
                              }`}
                              {...register("firstName", { required: true, minLength: 2, maxLength: 50 })}
                           />
                           {errors.firstName && <span className="text-xs text-rose-500">First name required.</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                           <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">Last Name</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="Sabir"
                              className="w-full p-3.5 border rounded-xl border-neutral-300 outline-none focus:ring-2 focus:ring-purple-500 transition text-sm"
                              {...register("lastName", { maxLength: 50 })}
                           />
                        </div>
                     </div>
                  </div>

                  <hr className="border-neutral-100" />

                  {/* Section B: Campus email domain verification boundary metrics */}
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <h2 className="text-base font-bold text-neutral-800">2. Academic Credentials</h2>
                        <p className="text-xs text-neutral-500">Verification is strictly limited to authorized NIT Raipur network lines.</p>
                     </div>

                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">Institutional Email Address *</label>
                        <input
                           type="email"
                           disabled={isLoading}
                           placeholder="username.id@nitrr.ac.in"
                           className={`w-full p-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition text-sm ${
                              errors.college_email ? "border-rose-500" : "border-neutral-300"
                           }`}
                           {...register("college_email", { 
                              required: true, 
                              validate: (val) => isValidNitrrEmail(val)
                           })}
                        />
                        <p className="text-[11px] text-neutral-400">Domain pattern must explicitly terminate with: <strong>@nitrr.ac.in</strong></p>
                        {errors.college_email && (
                           <span className="text-xs text-rose-500">Provide your institutional email.</span>
                        )}
                     </div>
                  </div>

                  <hr className="border-neutral-100" />

                  {/* Section C: Optional telecommunications indexing */}
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <h2 className="text-base font-bold text-neutral-800">3. Contact Details <span className="text-neutral-400 font-normal">(Optional)</span></h2>
                        <p className="text-xs text-neutral-500">Provide an optional mobile handle to streamline scheduling update pipelines.</p>
                     </div>

                     <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-600 uppercase tracking-wide">Phone Number</label>
                        <input
                           type="tel"
                           disabled={isLoading}
                           placeholder="+919876543210"
                           className={`w-full p-3.5 border rounded-xl outline-none focus:ring-2 focus:ring-purple-500 transition text-sm ${
                              errors.phone ? "border-rose-500" : "border-neutral-300"
                           }`}
                           {...register("phone", { 
                              pattern: /^\+?[1-9]\d{1,14}$/
                           })}
                        />
                        {errors.phone && <span className="text-xs text-rose-500">Please supply a valid E.164 phone formatting sequence.</span>}
                     </div>
                  </div>

                  {/* Action verification boundary */}
                  <div className="pt-4 flex justify-end">
                     <div className="w-full md:w-48">
                        <Button 
                           disabled={isLoading} 
                           label={isLoading ? "Saving Parameters..." : "Submit"} 
                           onClick={handleSubmit(onSubmit)} 
                        />
                     </div>
                  </div>

               </form>
            </div>
         </main>
      </div>
   );
}