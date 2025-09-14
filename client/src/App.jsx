import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Protected from './components/Protected'
import Header from './components/Header.jsx'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop.jsx'
import PageLoader from './components/PageLoader.jsx' // 👈 small spinner
import ErrorBoundary from './components/ErrorBoundary'

// 🔻 Lazy-load pages to code-split
const Home = lazy(() => import('./pages/Home'))
const Search = lazy(() => import('./pages/Search'))
const ListingDetail = lazy(() => import('./pages/ListingDetail'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const SeekerDashboard = lazy(() => import('./pages/SeekerDashboard'))
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Modern sticky header */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        <ScrollToTop />
        <ErrorBoundary>
        {/* Suspense shows a loader while each chunk is fetched */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset/:token" element={<ResetPassword />} />

            {/* Seeker dashboard (canonical) */}
            <Route
              path="/dashboard"
              element={
                <Protected role="seeker">
                  <SeekerDashboard />
                </Protected>
              }
            />
            {/* Back-compat alias */}
            <Route
              path="/seeker"
              element={
                <Protected role="seeker">
                  <SeekerDashboard />
                </Protected>
              }
            />

            {/* Owner area */}
            <Route
              path="/owner"
              element={
                <Protected role="owner">
                  <OwnerDashboard />
                </Protected>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Global toast notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </div>
  )
}
