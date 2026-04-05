import { Navigate, Outlet } from 'react-router-dom'
import { requireValidSession } from '../utils/authSession'

function ProtectedRoute() {
  const session = requireValidSession()

  if (!session.valid) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
