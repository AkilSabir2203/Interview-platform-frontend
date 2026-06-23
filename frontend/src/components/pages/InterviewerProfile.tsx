import { useMemo } from "react";
import { useAuth } from "../AuthProvider"; 

export default function InterviewerProfile() {
   // ⚡ Consume cached context memory and loading state partitions directly
   const { profile, currentUser, isLoading } = useAuth();

   // Dynamic Avatar Initial Symbol calculated cleanly out of structural state models
   const defaultAvatar = useMemo(() => {
      const emailInitial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : "I";
      return `https://ui-avatars.com/api/?name=${emailInitial}&background=6366f1&color=fff&size=150`;
   }, [currentUser?.email]);

   // Loading Skeleton State (Synchronized with global session initialization bootstrap)
   if (isLoading) {
      return (
         <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
            <div className="text-sm font-semibold text-neutral-500 animate-pulse">
               Loading interviewer dashboard profile...
            </div>
         </div>
      );
   }

   // Fallback Error Guard
   if (!profile) {
      return (
         <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans p-6">
            <div className="text-center bg-white p-8 rounded-2xl border border-neutral-200 max-w-md shadow-sm">
               <h3 className="text-base font-bold text-neutral-800 mb-1">No Profile Found</h3>
               <p className="text-sm text-neutral-500 mb-4">
                  You need to complete onboarding setup to initialize your workspace status index.
               </p>
            </div>
         </div>
      );
   }

   // Reconstruct structured full name from type-safe lowercase mapping properties
   const parsedFullName = profile.firstname 
      ? `${profile.firstname} ${profile.lastname || ""}`.trim() 
      : "Interviewer Member";

   // Safely extract company, position, image, and skills parameters from union type
   const company = "company" in profile ? profile.company : "";
   const position = "position" in profile ? profile.position : "";
   const skills = "skills" in profile ? profile.skills : [];
   const imageSrc = profile.image || defaultAvatar;

   return (
      <div className="min-h-screen bg-neutral-50 py-24 px-4 sm:px-6 lg:px-8 font-sans">
         <div className="max-w-2xl mx-auto space-y-8">
            
            {/* Heading Context block */}
            <div className="space-y-1">
               <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Workspace Settings
               </span>
               <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                  Interviewer Profile Matrix
               </h1>
               <p className="text-sm text-neutral-500">
                  This is how your technical credentials appear to candidates facing evaluation.
               </p>
            </div>

            {/* THE MATCHING ONBOARDING IDENTITY CARD REPLICA */}
            <div className="w-full bg-white rounded-2xl border border-neutral-200 p-8 shadow-xl flex flex-col gap-5 transition duration-300 hover:shadow-2xl">
               
               {/* Core Detail Header Area */}
               <div className="flex items-center gap-5">
                  <img 
                     src={imageSrc} 
                     alt="Interviewer Profile" 
                     className="h-20 w-20 rounded-full object-cover border-2 border-neutral-200 shadow-md"
                     onError={(e) => {
                        (e.target as HTMLImageElement).src = defaultAvatar;
                     }}
                  />
                  <div className="space-y-1">
                     <h2 className="text-xl font-black text-neutral-900 tracking-tight">
                        {parsedFullName}
                     </h2>
                     <p className="text-sm font-semibold text-neutral-600">
                        {position} {company && <><span className="text-neutral-400 font-normal">@</span> {company}</>}
                     </p>
                     {profile.phone && (
                        <p className="text-xs text-neutral-400 font-medium tracking-tight">
                           Index Link: {profile.phone}
                        </p>
                     )}
                  </div>
               </div>

               {/* Evaluation Specialties Badge Row (The 5 Skills Alignment Row) */}
               <div className="pt-4 border-t border-neutral-200">
                  <div className="flex flex-wrap gap-2">
                     {skills.map((skill: string) => (
                        <span 
                           key={skill} 
                           className="bg-purple-50 text-neutral-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-neutral-300/70 shadow-sm transition hover:bg-purple-100"
                        >
                           {skill}
                        </span>
                     ))}
                     {skills.length === 0 && (
                        <span className="text-xs italic text-neutral-400">
                           No assessment tracking domains assigned.
                        </span>
                     )}
                  </div>
               </div>

            </div>

            {/* Quick Context System Advisory Flag */}
            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/40 text-xs text-indigo-700 font-medium">
               💡 Data models mapped from the target PostgreSQL engine are currently stateless and immutable in this viewing index window.
            </div>

         </div>
      </div>
   );
}