import { useLocation } from 'react-router-dom'
import PillNav from './PillNav'

const topNavLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/courses', label: 'Courses' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/team', label: 'Team' },
  { to: '/developers', label: 'Developers' },
  { to: '/events', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
]

function Navbar() {
  const location = useLocation()
  const role = localStorage.getItem('role')

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

  const visibleLinks = [...topNavLinks, ...roleLinks].map((item) => ({
    label: item.label,
    href: item.to,
  }))

  return (
    <PillNav
      logo="https://png.pngtree.com/png-vector/20240705/ourmid/pngtree-photography-camera-icon-vector-png-image_7210634.png"
      logoAlt="Photography camera logo"
      items={visibleLinks}
      activeHref={location.pathname}
      className="custom-nav"
      ease="power2.easeOut"
      baseColor="#0a140d"
      pillColor="#1db954"
      hoveredPillTextColor="#f1fbf3"
      pillTextColor="#f1fbf3"
      pillGap="9px"
      pillPadX="24px"
      theme="light"
      initialLoadAnimation
    />
  )
}

export default Navbar
