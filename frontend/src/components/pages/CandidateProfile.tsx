import { useMemo } from "react";
import { useAuth } from "../AuthProvider";

const CandidateProfile = () => {
  // Extract the synchronized profile slice directly from global auth state context
  const { profile, isLoading } = useAuth();

  // Loading Skeleton State (Waits for AuthProvider bootstrapSession to conclude)
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-neutral-500">Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Fallback Error Guard
  if (!profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-sans px-4">
        <div className="text-center p-8 bg-white border border-neutral-200 rounded-2xl shadow-sm max-w-md">
          <h2 className="text-lg font-bold text-neutral-800">No Profile Found</h2>
          <p className="text-sm text-neutral-500 mt-2">
            We couldn't retrieve your workspace parameters. Please verify your onboarding status.
          </p>
        </div>
      </div>
    );
  }

  // Safely reconstruct structural full name from frontend interface state fields
  const parsedFullName = profile.firstname 
    ? `${profile.firstname} ${profile.lastname || ""}`.trim() 
    : "Candidate User";

  // ⚡ FIXED: Extract dual initials from both first and last name fields dynamically
  const initialSymbol = useMemo(() => {
    if (!parsedFullName || !parsedFullName.trim()) return "C";

    const parts = parsedFullName.trim().split(/\s+/);
    const firstLetter = parts[0]?.charAt(0) || "";
    const lastLetter = parts.length > 1 ? parts[parts.length - 1]?.charAt(0) : "";

    return (firstLetter + lastLetter).toUpperCase();
  }, [parsedFullName]);

  // Explicitly narrow down and extract college_email safely into a clean string variable
  const displayEmail = "college_email" in profile ? (profile.college_email as string) : profile.email;

  return (
    <div className="min-h-[75vh] bg-neutral-50/50 py-24 px-4 sm:px-6 lg:px-8 font-sans animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        
        {/* Main Profile Dashboard Wrapper Card */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
          
          {/* Header Banner Accenting Vector Block */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-indigo-600" />

          {/* User Metrics Info Layout Content Block */}
          <div className="px-8 pb-8 relative">
            
            {/* Hanging Identity Monogram Wrapper Box */}
            <div className="absolute -top-14 left-8 h-24 w-24 rounded-2xl bg-purple-700 text-white font-black text-4xl border-4 border-white shadow-md flex items-center justify-center select-none tracking-tighter">
              {initialSymbol}
            </div>

            {/* Name/Identity Header */}
            <div className="pt-14 mt-3">
              <h1 className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
                {parsedFullName}
              </h1>
              <p className="text-sm font-semibold text-purple-600 mt-0.5 tracking-wider uppercase">
                Candidate
              </p>
            </div>

            <hr className="my-6 border-neutral-200" />

            {/* Strict Schema Grid Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* College Institutional Email Cell */}
              <div className="flex flex-col gap-1 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Institutional Email
                </span>
                <span className="text-sm font-medium text-neutral-800 break-all select-all">
                  {displayEmail}
                </span>
              </div>

              {/* Direct Telephone Contact Cell */}
              <div className="flex flex-col gap-1 p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Phone
                </span>
                <span className="text-sm font-medium text-neutral-800">
                  {profile.phone || "No telephone index supplied"}
                </span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateProfile;