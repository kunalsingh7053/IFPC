import { Navigate, Outlet } from 'react-router-dom'

function MemberRoute() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role !== 'member') {
    return <Navigate to="/admin-dashboard" replace />
  }

  return <Outlet />
}

export default MemberRoute
