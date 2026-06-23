import { useAuth } from "../components/AuthProvider";
import InterviewerProfilePage from "../components/pages/InterviewerProfile";
import CandidateProfilePage from "../components/pages/CandidateProfile"; 

export default function ProfileGateway() {
   const { currentUser } = useAuth();

   // Split the profile view dynamically based on the logged-in user's role
   if (currentUser?.role === "interviewer") {
      return <InterviewerProfilePage />;
   }

   return <CandidateProfilePage />;
}