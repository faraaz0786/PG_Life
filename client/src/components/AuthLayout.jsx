import { motion } from 'framer-motion'

export default function AuthLayout({ title, subtitle, heroTitle = 'Welcome', heroCopy, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* LEFT: gradient hero (hidden on small screens) */}
      <aside className="relative hidden lg:flex overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-900" />

        {/* Animated blobs */}
        <motion.div
          className="absolute -left-40 -top-40 w-[600px] h-[600px] rounded-full bg-white/10 blur-2xl"
          initial={{ scale: 0.9, opacity: 0.3 }}
          animate={{ scale: 1.05, opacity: 0.4 }}
          transition={{ duration: 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-40 bottom-0 w-[520px] h-[520px] rounded-full bg-indigo-300/10 blur-2xl"
          initial={{ y: 30, opacity: 0.2 }}
          animate={{ y: -20, opacity: 0.35 }}
          transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />

        <div className="relative z-10 text-white w-full flex items-center">
          <motion.div
            className="mx-auto max-w-md p-10 space-y-6"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.1 }}
          >
            <div className="h-12 w-12 rounded-2xl bg-white/15 grid place-items-center text-white font-extrabold text-lg">PG</div>
            <h1 className="text-4xl font-extrabold leading-tight">{heroTitle}</h1>
            <p className="text-white/80">
              {heroCopy || 'Discover verified PGs, compare amenities & prices, and book visits — all in one place.'}
            </p>
          </motion.div>
        </div>
      </aside>

      {/* RIGHT: form column */}
      <main className="flex items-center justify-center p-6 md:p-10">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 16 }}
        >
          {/* smaller margin so button fits */}
          <div className="auth-header mb-4 text-center lg:text-left">
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{subtitle}</p>}
          </div>

          {/* tighter padding on compact heights via CSS */}
          <motion.div
            className="card p-6 auth-card"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: 0.05 }}
          >
            {children}
          </motion.div>

          <div className="mt-4 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} PG-Life — Demo/portfolio build
          </div>
        </motion.div>
      </main>
    </div>
  )
}
