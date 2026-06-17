import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthProvider"; // Adjust path if needed
import type { PropsWithChildren } from "react";

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles?: string[];
}>;

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  // 1. Wait for /me to finish checking the session
  if (isLoading) {
    return <div className="flex justify-center p-10">Loading application...</div>;
  }

  // 2. Unauthenticated users get kicked to login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3. Optional: Role-based access (e.g., stopping candidates from hitting interviewer pages)
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />; 
  }

  // --- THE ONBOARDING LOCKDOWN LOGIC ---

  const isOnboardingRoute = location.pathname.includes('/onboard');

  if (!currentUser.hasCompletedOnboarding) {
    // If they haven't finished, and they are trying to visit ANY page other than their specific onboarding page...
    if (!isOnboardingRoute) {
      // Force them to their specific role's onboarding page
      const targetOnboardingPath = currentUser.role === "interviewer" 
        ? "/auth/onboard-interviewer" 
        : "/auth/onboard-candidate";
        
      return <Navigate to={targetOnboardingPath} replace />;
    }
  } else {
    // If they HAVE finished onboarding, and they try to go back to the onboarding page...
    if (isOnboardingRoute) {
      // Kick them out to the dashboard/practice area
      return <Navigate to="/practice" replace />; 
    }
  }

  // If they pass all checks, render the protected page
  return children ? <>{children}</> : <Outlet />;
}
