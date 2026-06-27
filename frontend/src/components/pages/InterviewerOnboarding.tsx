import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, type FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../libs/axois"; 
import { useAuth } from "../AuthProvider";
import Button from "../ui/Button";
import { AVAILABLE_SKILLS } from "../../utils/constants";

const generateTimeSlots = (): string[] => {
   const slots: string[] = [];
   for (let h = 10; h <= 22; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`); 
   }
   return slots;
};

const TIME_SLOTS = generateTimeSlots();
const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Utility helper to convert "HH:MM" 24h format to a readable 12h format
const formatTo12Hour = (time24: string): string => {
   const [hourStr, minStr] = time24.split(":");
   const hour = parseInt(hourStr, 10);
   const ampm = hour >= 12 ? "PM" : "AM";
   const displayHour = hour % 12 === 0 ? 12 : hour % 12;
   return `${displayHour}:${minStr} ${ampm}`;
};

export default function InterviewerOnboarding() {
   const navigate = useNavigate();
   const { authToken, currentUser, loginContextSync } = useAuth(); 
   
   const [step, setStep] = useState(1);
   const [isLoading, setIsLoading] = useState(false);
   const [activeDayTab, setActiveDayTab] = useState("Monday");
   
   // Autocomplete helper state
   const [searchQuery, setSearchQuery] = useState("");
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

   const {
      register,
      handleSubmit,
      watch,
      setValue,
      formState: { errors },
   } = useForm<FieldValues>({
      defaultValues: {
         firstName: "",
         lastName: "",
         phone: "",
         company: "",
         position: "",
         interviewer_type: "technical", // Default value configured in lowercase
         skills: [], 
         availability_map: {}, // Holds key-value mapping: { "Monday": ["10:00", "10:30"], ... }
         profile_image_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg", 
      },
   });

   const watchedFirstName = watch("firstName");
   const watchedCompany = watch("company");
   const watchedPosition = watch("position");
   const watchedType = watch("interviewer_type");
   const watchedSkills = watch("skills") || [];
   const watchedAvailability = watch("availability_map") || {};

   // Filter domain skills based on user typing
   const filteredSuggestions = AVAILABLE_SKILLS.filter(
      (skill) =>
         skill.toLowerCase().includes(searchQuery.toLowerCase()) &&
         !watchedSkills.includes(skill)
   );

   const nextStep = () => {
      if (step === 1) {
         if (!watchedFirstName || watchedFirstName.trim().length < 2) {
            toast.error("Please enter a valid first name (min 2 characters).");
            return;
         }
      }
      if (step === 2) {
         if (!watchedCompany || watchedCompany.trim() === "") {
            toast.error("Company details are required.");
            return;
         }
         if (!watchedPosition || watchedPosition.trim() === "") {
            toast.error("Your professional role/position is required.");
            return;
         }
         if (!watchedType) {
            toast.error("Please choose an assessment panel focus area.");
            return;
         }
         if (watchedSkills.length === 0) {
            toast.error("Please select at least 1 core assessment skill.");
            return;
         }
         if (watchedSkills.length > 5) {
            toast.error("You can choose a maximum of 5 core assessment skills.");
            return;
         }
      }
      if (step === 3) {
         // Validation: Require at least one day to contain selected slots
         const totalSelectedSlots = Object.values(watchedAvailability).reduce(
            (acc: number, curr: any) => acc + (curr?.length || 0), 0
         );
         if (totalSelectedSlots === 0) {
            toast.error("Please select at least one available hour slot before proceeding.");
            return;
         }
      }
      setStep((prev) => prev + 1);
   };

   const prevStep = () => setStep((prev) => prev - 1);

   // Add skill tag
   const addSkillTag = (skill: string) => {
      if (watchedSkills.length >= 5) {
         toast.error("You can select up to 5 core skills only.");
         return;
      }
      const updated = [...watchedSkills, skill];
      setValue("skills", updated, { shouldValidate: true });
      setSearchQuery("");
      setIsDropdownOpen(false);
   };

   // Remove skill tag
   const removeSkillTag = (skillToRemove: string) => {
      const updated = watchedSkills.filter((s: string) => s !== skillToRemove);
      setValue("skills", updated, { shouldValidate: true });
   };

   // Checkbox-style dynamic state toggler for availability slots
   const toggleTimeSlot = (day: string, time: string) => {
      const updatedMap = { ...watchedAvailability };
      if (!updatedMap[day]) {
         updatedMap[day] = [];
      }

      if (updatedMap[day].includes(time)) {
         updatedMap[day] = updatedMap[day].filter((t: string) => t !== time);
         if (updatedMap[day].length === 0) {
            delete updatedMap[day];
         }
      } else {
         updatedMap[day] = [...updatedMap[day], time].sort();
      }

      setValue("availability_map", updatedMap, { shouldValidate: true });
   };

   // Quick Action Helpers
   const selectAllForDay = (day: string) => {
      const updatedMap = { ...watchedAvailability };
      updatedMap[day] = [...TIME_SLOTS];
      setValue("availability_map", updatedMap, { shouldValidate: true });
   };

   const clearAllForDay = (day: string) => {
      const updatedMap = { ...watchedAvailability };
      delete updatedMap[day];
      setValue("availability_map", updatedMap, { shouldValidate: true });
   };

   const onSubmit: SubmitHandler<FieldValues> = async (data) => {
      setIsLoading(true);
      const fName = data.firstName.trim();
      const lName = data.lastName ? data.lastName.trim() : "";
      const combinedName = lName ? `${fName} ${lName}` : fName;

      const payload = {
         name: combinedName,
         phone: data.phone.trim() === "" ? null : data.phone.trim(),
         company: data.company.trim(),
         position: data.position.trim(),
         interviewer_type: data.interviewer_type ? data.interviewer_type.toLowerCase() : "technical", 
         profile_image_url: data.profile_image_url.trim() === "" ? null : data.profile_image_url.trim(),
         skills: data.skills, 
         availability_map: data.availability_map, // Captured JSON matching dict[str, list[str]]
      };

      try {
         await api.post("/api/v1/auth/onboard-interviewer", payload, {
            headers: { Authorization: `Bearer ${authToken}` }
         });

         toast.success("Interviewer profile & schedule configured! Welcome aboard.");
         
         if (authToken && currentUser) {
            const updatedUser = {
               ...currentUser,
               hasCompletedOnboarding: true 
            };
            loginContextSync(authToken, updatedUser); 
         }

         setTimeout(() => {
            navigate("/"); 
         }, 50);

      } catch (error: any) {
         const errorMsg = error.response?.data?.detail || "Failed to save interviewer workspace data.";
         toast.error(errorMsg);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-50 bg-neutral-50 flex flex-col h-screen w-screen font-sans">
         {/* HEADER LOG */}
         <header className="flex items-center justify-between px-8 pt-20 py-5 border-b border-neutral-200 bg-white shadow-sm shrink-0">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Step {step} of 4 — Interviewer Onboarding
               </span>
               <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight">
                  {step === 1 && "Basic Identification"}
                  {step === 2 && "Expertise & Background"}
                  {step === 3 && "Recurring Weekly Availability"}
                  {step === 4 && "Onboarding Summary Verification"}
               </h1>
            </div>
            
            <div className="flex items-center gap-2">
               {[1, 2, 3, 4].map((s) => (
                  <div 
                     key={s} 
                     className={`h-2.5 w-8 rounded-full transition-all duration-300 ${
                        s <= step ? "bg-indigo-600 w-12" : "bg-neutral-200"
                     }`}
                  />
               ))}
            </div>
         </header>

         {/* FORM SCROLLABLE MAIN REGION */}
         <main className="flex-1 overflow-y-auto px-6 py-8 flex justify-center items-start">
            <div className="w-full max-w-4xl bg-white rounded-2xl border border-neutral-200 p-8 md:p-10 shadow-xl my-4">
               
               {/* STEP 1: Basic Bio & Phone Contact */}
               {step === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Let's setup your account details</h2>
                        <p className="text-sm text-neutral-500">Provide your official professional name and operational contact index.</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">First Name *</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="Amrit"
                              className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                 errors.firstName ? "border-rose-500" : "border-neutral-300"
                              }`}
                              {...register("firstName", { required: true, minLength: 2, maxLength: 50 })}
                           />
                           {errors.firstName && <span className="text-xs text-rose-500">First name requires 2+ characters.</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">Last Name</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="Utsav"
                              className="w-full p-4 border rounded-xl border-neutral-300 outline-none focus:ring-2 focus:ring-indigo-500 transition"
                              {...register("lastName", { maxLength: 50 })}
                           />
                        </div>
                     </div>

                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-neutral-600 uppercase">Phone Number</label>
                        <input
                           type="tel"
                           disabled={isLoading}
                           placeholder="9608624711"
                           className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                              errors.phone ? "border-rose-500" : "border-neutral-300"
                           }`}
                           {...register("phone", { 
                              pattern: /^\+?[1-9]\d{1,14}$/
                           })}
                        />
                        {errors.phone && <span className="text-xs text-rose-500">Please supply a valid E.164 phone number pattern.</span>}
                     </div>
                  </div>
               )}

               {/* STEP 2: Company, Position, Type & Skills Autocomplete */}
               {step === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Professional Background</h2>
                        <p className="text-sm text-neutral-500">Help candidates know your focus area. Type or select 1 to 5 target skill groups.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">Company *</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="Google / Stripe"
                              className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                 errors.company ? "border-rose-500" : "border-neutral-300"
                              }`}
                              {...register("company", { required: true })}
                           />
                           {errors.company && <span className="text-xs text-rose-500">Company field is mandatory.</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">Position / Role *</label>
                           <input
                              type="text"
                              disabled={isLoading}
                              placeholder="Senior Staff Engineer"
                              className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                                 errors.position ? "border-rose-500" : "border-neutral-300"
                              }`}
                              {...register("position", { required: true })}
                           />
                           {errors.position && <span className="text-xs text-rose-500">Position title is mandatory.</span>}
                        </div>
                     </div>

                     {/* INTERVIEWER TYPE SELECTOR PANEL */}
                     <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-neutral-600 uppercase">Assessment Panel Type *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                           {[
                              { label: "Technical Core", value: "technical", desc: "DSA, Core, Systems" },
                              { label: "Non-Technical / Behavioral", value: "non_technical", desc: "HR, Culture, Management" },
                              { label: "Both", value: "both", desc: "Evaluates across both tracks" }
                           ].map((item) => (
                              <label
                                 key={item.value}
                                 className={`p-4 border rounded-xl flex flex-col justify-between cursor-pointer transition select-none ${
                                    watchedType === item.value 
                                       ? "border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 text-indigo-950" 
                                       : "border-neutral-200 hover:bg-neutral-50 text-neutral-700"
                                 }`}
                              >
                                 <div className="flex items-center justify-between w-full mb-1">
                                    <span className="text-sm font-bold">{item.label}</span>
                                    <input 
                                       type="radio" 
                                       value={item.value}
                                       className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                       {...register("interviewer_type", { required: true })}
                                    />
                                 </div>
                                 <span className="text-xs text-neutral-400 font-medium leading-relaxed">{item.desc}</span>
                              </label>
                           ))}
                        </div>
                     </div>

                     {/* AUTOCOMPLETE DOMAIN SKILLS TAGGER */}
                     <div className="flex flex-col gap-2 relative">
                        <div className="flex justify-between items-center">
                           <label className="text-xs font-semibold text-neutral-600 uppercase">Core Assessment Domain Skills *</label>
                           <span className="text-xs font-medium text-neutral-400">{watchedSkills.length}/5 Selected</span>
                        </div>

                        <div className="w-full p-3 border border-neutral-300 bg-white rounded-xl flex flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition">
                           {watchedSkills.map((skill: string) => (
                              <span 
                                 key={skill} 
                                 className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-100"
                              >
                                 {skill}
                                 <button
                                    type="button"
                                    onClick={() => removeSkillTag(skill)}
                                    className="text-indigo-400 hover:text-indigo-800 font-bold transition rounded"
                                 >
                                    &times;
                                 </button>
                              </span>
                           ))}

                           <input
                              type="text"
                              value={searchQuery}
                              disabled={isLoading || watchedSkills.length >= 5}
                              onFocus={() => setIsDropdownOpen(true)}
                              onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={watchedSkills.length >= 5 ? "Max skills reached" : "Type to filter skills..."}
                              className="flex-1 min-w-45 bg-transparent outline-none text-sm text-neutral-800 py-1 disabled:cursor-not-allowed"
                           />
                        </div>

                        {isDropdownOpen && filteredSuggestions.length > 0 && watchedSkills.length < 5 && (
                           <div className="absolute top-full left-0 w-full bg-white border border-neutral-200 shadow-xl rounded-xl z-50 mt-1 max-h-56 overflow-y-auto divide-y divide-neutral-50">
                              {filteredSuggestions.map((suggestion) => (
                                 <button
                                    type="button"
                                    key={suggestion}
                                    onMouseDown={() => addSkillTag(suggestion)}
                                    className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-indigo-50 hover:text-indigo-900 font-medium transition duration-150"
                                 >
                                    {suggestion}
                                 </button>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {/* STEP 3: Checkbox Grid Availability Picker */}
               {step === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Weekly Available Time slots (IST)</h2>
                        <p className="text-sm text-neutral-500">
                           Configure standard operating times where you are open for assessments. Slots run from <strong>10:00 AM to 10:00 PM</strong> in 30-minute intervals.
                        </p>
                     </div>

                     {/* Lateral Layout Splitter: Day Tabs & Time Slot Checkbox Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                        {/* Day Tabs Left column Selector */}
                        <div className="bg-neutral-50 border-r border-neutral-200 flex flex-row md:flex-col p-2 gap-1 overflow-x-auto md:overflow-x-visible shrink-0">
                           {DAYS_OF_WEEK.map((day) => {
                              const activeCount = watchedAvailability[day]?.length || 0;
                              return (
                                 <button
                                    type="button"
                                    key={day}
                                    onClick={() => setActiveDayTab(day)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition duration-150 text-left min-w-27.5 md:w-full ${
                                       activeDayTab === day
                                          ? "bg-indigo-600 text-white shadow-sm"
                                          : "text-neutral-700 hover:bg-neutral-200/50"
                                    }`}
                                 >
                                    <span>{day}</span>
                                    {activeCount > 0 && (
                                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                          activeDayTab === day ? "bg-white text-indigo-700" : "bg-indigo-100 text-indigo-700"
                                       }`}>
                                          {activeCount}
                                       </span>
                                    )}
                                 </button>
                              );
                           })}
                        </div>

                        {/* Interactive Time Selection Right Column Grid */}
                        <div className="col-span-1 md:col-span-3 p-6 space-y-4">
                           <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                              <h3 className="font-bold text-neutral-800">{activeDayTab} Availability</h3>
                              <div className="flex gap-2">
                                 <button
                                    type="button"
                                    onClick={() => selectAllForDay(activeDayTab)}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
                                 >
                                    Select All
                                 </button>
                                 <span className="text-neutral-300 text-xs">|</span>
                                 <button
                                    type="button"
                                    onClick={() => clearAllForDay(activeDayTab)}
                                    className="text-xs font-bold text-rose-500 hover:text-rose-700 transition"
                                 >
                                    Clear All
                                 </button>
                              </div>
                           </div>

                           <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-70 overflow-y-auto pr-1">
                              {TIME_SLOTS.map((time) => {
                                 const isChecked = watchedAvailability[activeDayTab]?.includes(time);
                                 return (
                                    <label
                                       key={time}
                                       className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer select-none transition ${
                                          isChecked
                                             ? "border-indigo-600 bg-indigo-50/50 text-indigo-900"
                                             : "border-neutral-200 hover:border-indigo-300 hover:bg-neutral-50"
                                       }`}
                                    >
                                       <span className="text-xs font-semibold">{formatTo12Hour(time)}</span>
                                       <input
                                          type="checkbox"
                                          checked={!!isChecked}
                                          onChange={() => toggleTimeSlot(activeDayTab, time)}
                                          className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                       />
                                    </label>
                                 );
                              })}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {/* STEP 4: Comprehensive Verification Summary */}
               {step === 4 && (
                  <div className="space-y-6 animate-fadeIn">
                     <div className="space-y-2">
                        <h2 className="text-lg font-bold text-neutral-800">Verify & Complete Profile</h2>
                        <p className="text-sm text-neutral-500">Please review all your details and weekly calendar availability before final submission.</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Summary Block Left Card: Main details */}
                        <div className="flex flex-col gap-4 p-6 rounded-xl border border-neutral-200 bg-neutral-50/50 shadow-inner">
                           <div className="flex items-center gap-4 border-b border-neutral-200 pb-4">
                              <img 
                                 src={watch("profile_image_url") || "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"} 
                                 alt="Avatar preview" 
                                 className="h-16 w-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm shrink-0"
                                 onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
                                 }}
                              />
                              <div>
                                 <h4 className="text-base font-bold text-neutral-900">{watchedFirstName || "Interviewer Profile"}</h4>
                                 <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">{watchedPosition || "Engineer"} @ {watchedCompany || "Company"}</p>
                                 <span className="inline-block bg-neutral-200 text-neutral-800 text-[10px] font-extrabold px-2 py-0.5 rounded mt-1 uppercase tracking-wide">
                                    Track: {watchedType?.replace('_', ' ')}
                                 </span>
                              </div>
                           </div>

                           <div className="space-y-3 text-sm">
                              <div>
                                 <span className="text-neutral-400 font-medium block text-xs">Profile Image URL</span>
                                 <input
                                    type="url"
                                    disabled={isLoading}
                                    className="w-full p-2.5 mt-1 border border-neutral-300 bg-white rounded-lg outline-none text-xs"
                                    {...register("profile_image_url")}
                                 />
                              </div>

                              <div>
                                 <span className="text-neutral-400 font-medium block text-xs">Assessment Domains</span>
                                 <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {watchedSkills.map((skill: string) => (
                                       <span 
                                          key={skill} 
                                          className="bg-indigo-100/60 text-indigo-800 text-[10px] font-bold px-2.5 py-1 rounded-md"
                                       >
                                          {skill}
                                       </span>
                                    ))}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Summary Block Right Card: Availability */}
                        <div className="flex flex-col p-6 rounded-xl border border-neutral-200 bg-neutral-50/50 shadow-inner">
                           <h3 className="font-bold text-neutral-800 text-sm border-b border-neutral-200 pb-2 mb-3 flex items-center justify-between">
                              <span>Configured Hours (IST)</span>
                              <button 
                                 type="button" 
                                 onClick={() => setStep(3)} 
                                 className="text-xs text-indigo-600 hover:underline font-semibold"
                              >
                                 Edit Slots
                              </button>
                           </h3>
                           
                           <div className="space-y-2.5 flex-1 overflow-y-auto max-h-55 pr-1">
                              {DAYS_OF_WEEK.map((day) => {
                                 const slots = watchedAvailability[day] || [];
                                 if (slots.length === 0) return null;
                                 return (
                                    <div key={day} className="flex gap-2 text-xs">
                                       <span className="font-bold text-neutral-700 w-20 shrink-0">{day}:</span>
                                       <div className="flex flex-wrap gap-1">
                                          {slots.map((s: string) => (
                                             <span key={s} className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-medium text-neutral-600">
                                                {formatTo12Hour(s)}
                                             </span>
                                          ))}
                                       </div>
                                    </div>
                                 );
                              })}
                              {Object.keys(watchedAvailability).length === 0 && (
                                 <p className="text-xs italic text-rose-500">No availability hours selected.</p>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
               )}

            </div>
         </main>

         {/* BOTTOM FOOTER NAVIGATION PANEL */}
         <footer className="border-t z-0 border-neutral-200 bg-white px-8 py-5 flex items-center justify-between shadow-md shrink-0">
            <div>
               {step > 1 ? (
                  <Button
                     outline
                     disabled={isLoading}
                     label="Back"
                     onClick={prevStep}
                  />
               ) : (
                  <div className="text-xs text-neutral-400 font-medium">Setting up your profile access takes less than a minute.</div>
               )}
            </div>

            <div className="w-full md:w-auto">
               {step < 4 ? (
                  <Button 
                     label="Next" 
                     onClick={nextStep} 
                  />
               ) : (
                  <Button 
                     disabled={isLoading} 
                     label={isLoading ? "Saving..." : "Submit Profile"} 
                     onClick={handleSubmit(onSubmit)} 
                  />
               )}
            </div>
         </footer>
      </div>
   );
}