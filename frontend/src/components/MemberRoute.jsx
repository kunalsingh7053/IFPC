import { Navigate, Outlet } from 'react-router-dom'
import { requireValidSession } from '../utils/authSession'

function MemberRoute() {
  const session = requireValidSession()

  if (!session.valid) {
    return <Navigate to="/login" replace />
  }

  if (session.role !== 'member' && session.role !== 'admin') {
    return <Navigate to="/admin-dashboard" replace />
  }

  return <Outlet />
}

export default MemberRoute
