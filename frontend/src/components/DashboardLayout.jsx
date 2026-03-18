import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'

function DashboardLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-grid">
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="animate-float-slow pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -16, 0], y: [0, 18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="animate-float-fast pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div className="relative min-h-screen">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:py-8">
          <div className="glass-panel rounded-3xl p-4 md:p-6">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default DashboardLayout
