import { Navigate, Outlet } from 'react-router-dom'

function AdminRoute() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role !== 'admin') {
    return <Navigate to="/member-dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute
