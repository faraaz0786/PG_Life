import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import * as Tooltip from '@radix-ui/react-tooltip'   // ✅ Tooltip imported

import Protected from './components/Protected'
import Header from './components/Header.jsx'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop.jsx'
import PageLoader from './components/PageLoader.jsx'
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
  const location = useLocation()

  // Reusable route transition wrapper
  const PageTransition = ({ children }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )

  return (
    // ✅ Tooltip.Provider added here (wraps entire app)
    <Tooltip.Provider delayDuration={150}>
    <div id="recaptcha-container" style={{ display: 'none' }} />

      <div className="min-h-screen flex flex-col bg-background text-slate-800 dark:text-slate-100 transition-colors">
        {/* Sticky header */}
        <Header />

        {/* Main content */}
        <main className="flex-1">
          <ScrollToTop />
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              {/* AnimatePresence enables smooth route exit/entry */}
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route
                    path="/"
                    element={
                      <PageTransition>
                        <Home />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <PageTransition>
                        <Search />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/listing/:id"
                    element={
                      <PageTransition>
                        <ListingDetail />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <PageTransition>
                        <Login />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <PageTransition>
                        <Register />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/forgot"
                    element={
                      <PageTransition>
                        <ForgotPassword />
                      </PageTransition>
                    }
                  />
                  <Route
                    path="/reset/:token"
                    element={
                      <PageTransition>
                        <ResetPassword />
                      </PageTransition>
                    }
                  />

                  {/* Seeker dashboard */}
                  <Route
                    path="/dashboard"
                    element={
                      <Protected role="seeker">
                        <PageTransition>
                          <SeekerDashboard />
                        </PageTransition>
                      </Protected>
                    }
                  />
                  {/* Back-compat alias */}
                  <Route
                    path="/seeker"
                    element={
                      <Protected role="seeker">
                        <PageTransition>
                          <SeekerDashboard />
                        </PageTransition>
                      </Protected>
                    }
                  />

                  {/* Owner area */}
                  <Route
                    path="/owner"
                    element={
                      <Protected role="owner">
                        <PageTransition>
                          <OwnerDashboard />
                        </PageTransition>
                      </Protected>
                    }
                  />

                  {/* 404 */}
                  <Route
                    path="*"
                    element={
                      <PageTransition>
                        <NotFound />
                      </PageTransition>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        {!['/login', '/register', '/forgot', '/reset'].includes(location.pathname) && <Footer />}

        {/* Global toast notifications */}
        <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
      </div>
    </Tooltip.Provider>
  )
}
