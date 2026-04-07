import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PillNav from './PillNav'
import { IFPC_LOGO_URL } from '../utils/branding'
import { getAuthSession } from '../utils/authSession'
import API from '../api/axios'

const topNavLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/equipment', label: 'Equipment' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/team', label: 'Team' },
  { to: '/events', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
  { to: '/developers', label: 'Developers' },
]

function Navbar() {
  const location = useLocation()
  const session = getAuthSession()
  const role = session?.role
  const [registrationOpen, setRegistrationOpen] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadRegistrationStatus() {
      try {
        const { data } = await API.get('/auth/member-registration-status')
        if (mounted) {
          setRegistrationOpen(Boolean(data?.data?.memberRegistrationOpen))
        }
      } catch {
        if (mounted) {
          setRegistrationOpen(false)
        }
      }
    }

    loadRegistrationStatus()
    return () => {
      mounted = false
    }
  }, [])

  const roleLinks =
    role === 'admin'
      ? [
          { to: '/admin-dashboard', label: 'Dashboard' },
          { to: '/profile', label: 'Profile' },
        ]
      : role === 'member'
      ? [
          { to: '/member-dashboard', label: 'Dashboard' },
          { to: '/chat', label: 'Chat' },
          { to: '/profile', label: 'Profile' },
        ]
      : []

  const visibleLinks = useMemo(() => {
    const registrationLink =
      registrationOpen && !role
        ? [{ to: '/register', label: 'Register Open', blink: true }]
        : []

    return [...topNavLinks, ...registrationLink, ...roleLinks].map((item) => ({
      label: item.label,
      href: item.to,
      blink: Boolean(item.blink),
    }))
  }, [registrationOpen, role])

  return (
    <PillNav
      logo={IFPC_LOGO_URL}
      logoAlt="IFPC official logo"
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
