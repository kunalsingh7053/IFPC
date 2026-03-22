import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import API from '../api/axios'

const topNavLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/faculty', label: 'Faculty' },
  { to: '/events', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const fullName =
    user?.fullName?.firstName && user?.fullName?.lastName
      ? `${user.fullName.firstName} ${user.fullName.lastName}`
      : user?.username || 'Guest'

  const roleLinks =
    role === 'admin'
      ? [
          { to: '/admin-dashboard', label: 'Dashboard' },
          { to: '/members', label: 'Members' },
          { to: '/add-event', label: 'Add Event' },
          { to: '/chat', label: 'Chat' },
          { to: '/profile', label: 'Profile' },
        ]
      : role === 'member'
      ? [
          { to: '/member-dashboard', label: 'Dashboard' },
          { to: '/chat', label: 'Chat' },
          { to: '/profile', label: 'Profile' },
        ]
      : []

  const visibleLinks = [...topNavLinks, ...roleLinks]

  async function handleLogout() {
    try {
      if (role === 'admin') {
        await API.post('/auth/logout')
      } else if (role === 'member') {
        await API.post('/users/logout')
      }
    } catch {
      // clear client session even if API fails
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="sticky top-0 z-40 w-full border-b border-cyan-300/25 bg-[linear-gradient(145deg,rgba(5,10,24,0.62),rgba(8,14,30,0.38))] px-4 py-2 shadow-[0_14px_40px_rgba(2,6,18,0.45)] backdrop-blur-2xl md:px-6"
    >
      <div className="flex min-h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="group flex items-center gap-3">
            <span className="relative">
              <span className="pointer-events-none absolute -inset-2 rounded-full bg-cyan-300/30 blur-md transition-opacity group-hover:opacity-100" />
              <img
                src="/images/ifpc-icon.png"
                alt="IFPC logo"
                className="relative h-9 w-9 rounded-full border border-cyan-300/55 object-cover shadow-lg shadow-cyan-500/35"
              />
            </span>
            <span>
              <span className="block text-base font-black tracking-wide text-cyan-200 drop-shadow-[0_0_16px_rgba(56,189,248,0.6)] sm:text-lg">IFPC Portal</span>
              <span className="hidden text-[11px] uppercase tracking-[0.14em] text-slate-400 sm:block">Film & Photography Community</span>
            </span>
          </Link>

          <nav className="ml-4 hidden items-center gap-2 lg:flex">
            {visibleLinks.map((item) => (
              <NavLink
                key={`${item.to}-${item.label}`}
                to={item.to}
                className={({ isActive }) =>
                  `group relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-cyan-100'
                      : 'text-slate-300 hover:bg-white/8 hover:text-cyan-100'
                  }`
                }
              >
                {item.label}
                <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-cyan-300 to-fuchsia-300 transition-transform duration-300 group-hover:scale-x-100" />
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <p className="hidden rounded-lg border border-cyan-300/20 bg-white/5 px-3 py-1.5 text-sm text-slate-300 sm:block">{fullName}</p>
          {role ? (
            <button
              onClick={handleLogout}
              className="rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:scale-[1.02] sm:px-4"
            >
              Logout
            </button>
          ) : (
            <Link className="rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-600/30 hover:scale-[1.02] sm:px-4" to="/login">
              Login
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/25 bg-white/10 text-slate-100 lg:hidden"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className={`h-0.5 rounded-full bg-current transition ${mobileOpen ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`h-0.5 rounded-full bg-current transition ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`h-0.5 rounded-full bg-current transition ${mobileOpen ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="mb-2 mt-2 grid gap-1 rounded-xl border border-cyan-300/20 bg-slate-950/85 p-2 lg:hidden"
        >
          {visibleLinks.map((item) => (
            <NavLink
              key={`mobile-${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-cyan-100'
                    : 'text-slate-200 hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </motion.nav>
      )}
    </motion.header>
  )
}

export default Navbar
