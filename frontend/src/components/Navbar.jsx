import { motion } from 'framer-motion'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import API from '../api/axios'

const topNavLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/team', label: 'Team' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null

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
      className="glass-panel sticky top-0 z-30 mx-2 mt-2 flex min-h-16 items-center justify-between rounded-2xl px-4 py-2 md:mx-4 md:px-6"
    >
      <div className="flex items-center gap-3">
        <Link to="/" className="photo-title-glow text-lg font-bold tracking-wide text-amber-300">
          IFPC Portal
        </Link>

        <nav className="ml-4 hidden items-center gap-2 lg:flex">
          {visibleLinks.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/25 to-cyan-400/20 text-amber-200'
                    : 'text-slate-300 hover:bg-white/10 hover:text-amber-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <p className="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 sm:block">{fullName}</p>
        {role ? (
          <button
            onClick={handleLogout}
            className="rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 hover:scale-[1.02]"
          >
            Logout
          </button>
        ) : (
          <Link className="rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-600/20 hover:scale-[1.02]" to="/login">
            Login
          </Link>
        )}
      </div>
    </motion.header>
  )
}

export default Navbar
