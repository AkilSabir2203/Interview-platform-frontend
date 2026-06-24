import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../components/AuthProvider"; 
import type { PropsWithChildren } from "react";

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles?: string[];
}>;

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const location = useLocation();

  // 1. Freeze component tree rendering while user context initializes
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 p-10">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-neutral-500 animate-pulse">Loading application...</p>
        </div>
      </div>
    );
  }

  // 2. Clear unauthenticated sessions out to Auth forms
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 3. Track operational routes
  const isOnboardingRoute = location.pathname.includes('/onboard');

  // 4. Handle Role Access Control Boundaries
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (!currentUser.hasCompletedOnboarding) {
      const targetOnboardingPath = currentUser.role === "interviewer" 
        ? "/auth/onboard-interviewer" 
        : "/auth/onboard-candidate";
      return <Navigate to={targetOnboardingPath} replace />;
    }
    return <Navigate to="/practice" replace />; 
  }

  // 5. Enforce Onboarding Machine State
  if (!currentUser.hasCompletedOnboarding) {
    if (!isOnboardingRoute) {
      const targetOnboardingPath = currentUser.role === "interviewer" 
        ? "/auth/onboard-interviewer" 
        : "/auth/onboard-candidate";
        
      console.warn(`🔒 Access Denied. Redirecting un-onboarded ${currentUser.role} to tracking setup.`);
      return <Navigate to={targetOnboardingPath} replace />;
    }
  } else {
    // Prevent onboarded profiles from regressing back into onboarding steps
    if (isOnboardingRoute) {
      return <Navigate to="/practice" replace />; 
    }
  }

  // 6. Everything checks out perfectly -> Render requested viewport tree
  return children ? <>{children}</> : <Outlet />;
}