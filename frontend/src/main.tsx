import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './index.css';

// Global Layout Components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';

// Application Pages
import Landing from './components/pages/Landing';
import Problems from './components/pages/Problems';
import Experiences from './components/pages/Experiences';
import Practice from './components/pages/Practice';

// Modals / Auth Systems
import LoginModal from './components/modals/LoginModal';
import SignupModal from './components/modals/SignupModal';
import AuthProvider from './components/AuthProvider';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import ProfileGateway from './routes/ProfileGateway';

// Onboarding Modules
import CandidateOnboarding from './components/pages/CandidateOnboarding';
import InterviewerOnboarding from './components/pages/InterviewerOnboarding';

import ToasterProvider from './components/ToasterProvider';

const router = createBrowserRouter([
  {
    // GROUP 1: Core Layout with Navbar and Footer
    element: (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="grow">
          <Outlet /> 
        </main>
        <Footer />
      </div>
    ),
    children: [
      // 🔓 PUBLIC AUTHENTICATION GATEWAYS
      { path: "/auth/login", element: <LoginModal /> },
      { path: "/auth/signup", element: <SignupModal /> },

      // 🔐 SECURED APPLICATION PATHS (Must be logged in AND fully onboarded)
      {
        element: <ProtectedRoute />, 
        children: [
          { path: "/", element: <Landing /> }, 
          { path: "/problems", element: <Problems /> },
          { path: "/practice", element: <Practice /> },
          { path: "/experiences", element: <Experiences /> },
          { path: "/profile", element: <ProfileGateway /> },
        ]
      },

      // 🛠️ ROLE-BASED ONBOARDING FLUXES (Must be logged in, onboarding pending)
      { 
        path: "/auth/onboard-candidate",
        element: (
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateOnboarding />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/auth/onboard-interviewer",
        element: (
          <ProtectedRoute allowedRoles={['interviewer']}>
            <InterviewerOnboarding />
          </ProtectedRoute>
        ) 
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToasterProvider />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);