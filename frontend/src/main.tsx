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
      { path: "/practice", element: <Practice /> },
      { path: "/experiences", element: <Experiences /> },
      { path: "/discussions", element: <Discussions /> },
      { path: "/user/login", element: <LoginModal /> },
      { path: "/user/signup", element: <SignupModal /> },
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
    <RouterProvider router={router} />
  </StrictMode>,
)