import { NavLink } from 'react-router-dom'

const commonLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events' },
  { to: '/team', label: 'Team' },
  { to: '/profile', label: 'Profile' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const adminLinks = [
  { to: '/admin-dashboard', label: 'Admin Dashboard' },
  { to: '/members', label: 'Members List' },
  { to: '/add-member', label: 'Add Member' },
  { to: '/add-event', label: 'Add Event' },
]

const memberLinks = [{ to: '/member-dashboard', label: 'Member Dashboard' }]

function Sidebar({ open, onClose }) {
  const role = localStorage.getItem('role')
  const links = [...commonLinks, ...(role === 'admin' ? adminLinks : memberLinks)]

  return (
    <aside
      className={`glass-panel fixed inset-y-2 left-2 z-40 w-64 max-w-[85vw] rounded-2xl p-6 text-slate-200 transition-transform sm:w-72 md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="mb-8 flex items-center justify-between">
        <h2 className="photo-title-glow text-xl font-bold text-emerald-300">IFPC</h2>
        <button onClick={onClose} className="rounded-lg border border-white/15 bg-white/10 px-2 py-1 md:hidden">X</button>
      </div>

      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/25 to-emerald-500/20 text-emerald-100 shadow-lg shadow-black/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
