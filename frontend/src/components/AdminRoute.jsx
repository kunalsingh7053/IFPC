import { Navigate, Outlet } from 'react-router-dom'
import { requireValidSession } from '../utils/authSession'

function AdminRoute() {
  const session = requireValidSession()

  if (!session.valid) {
    return <Navigate to="/login" replace />
  }

  if (session.role !== 'admin') {
    return <Navigate to="/member-dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute
