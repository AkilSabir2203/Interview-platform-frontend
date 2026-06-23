import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './index.css'

// 1. Import your global components
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'

// 2. Import your pages
import Landing from './components/pages/Landing'
import Discussions from './components/pages/Discussions'
import Experiences from './components/pages/Experiences'
import Practice from './components/pages/Practice'

import LoginModal from './components/modals/LoginModal'
import SignupModal from './components/modals/SignupModal'
import AuthProvider from './components/AuthProvider'

import ProtectedRoute from './routes/ProtectedRoute'
import ProfileGateway from './routes/ProfileGateway'

import CandidateOnboarding from './components/pages/CandidateOnboarding'
import InterviewerOnboarding from './components/pages/InterviewerOnboarding'

import ToasterProvider from './components/ToasterProvider'

// 3. Create the Router Configuration
const router = createBrowserRouter([
  {
    // GROUP 1: Pages WITH Navbar and Footer
    element: (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {/* <Outlet /> injects your pages here */}
        <main className="grow">
            <Outlet /> 
        </main>
        <Footer />
      </div>
    ),
    children: [
      { path: "/", element: <Landing /> }, 
      { path: "/discussions", element: <Discussions /> },
      { path: "/auth/login", element: <LoginModal /> },
      { path: "/auth/signup", element: <SignupModal /> },
      { 
        path: "/auth/onboard-candidate",
        element: (
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateOnboarding />
          </ProtectedRoute>
        ) 
      },
      { 
        // 👈 Added Interviewer Onboarding Route block
        path: "/auth/onboard-interviewer",
        element: (
          <ProtectedRoute allowedRoles={['interviewer']}>
            <InterviewerOnboarding />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/practice", 
        element: (
          <ProtectedRoute allowedRoles={['candidate','interviewer']}>
            <Practice />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/experiences", 
        element: (
          <ProtectedRoute allowedRoles={['candidate']}>
            <Experiences />
          </ProtectedRoute>
        ) 
      },
      { 
        path: "/profile", 
        element: (
          <ProtectedRoute allowedRoles={['candidate', 'interviewer']}>
            <ProfileGateway />
          </ProtectedRoute>
        ) 
      },
    ]
  },
  {
    // GROUP 2: Pages WITHOUT Navbar and Footer (Auth pages)
    element: <Outlet />, 
    children: [
    ]
  }
])

// 4. Render the Router
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <ToasterProvider />
        <RouterProvider router={router} />
      </AuthProvider>
  </StrictMode>,
)