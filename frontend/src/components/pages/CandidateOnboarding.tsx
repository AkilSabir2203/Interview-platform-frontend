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