import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'

function DashboardLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-grid">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_16%,rgba(245,158,11,0.14),transparent_32%),radial-gradient(circle_at_82%_20%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_45%_110%,rgba(16,185,129,0.12),transparent_40%)]"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 22, 0], y: [0, -16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="animate-float-slow pointer-events-none absolute -top-16 -left-16 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -16, 0], y: [0, 18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="animate-float-fast pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div className="relative min-h-screen">
        <Navbar />
        <main className="w-full pt-20 md:pt-24">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default DashboardLayout
