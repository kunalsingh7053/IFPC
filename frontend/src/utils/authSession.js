function clearAuthSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('user')
}

function decodeJwtPayload(token) {
  try {
    const parts = String(token || '').split('.')
    if (parts.length !== 3) return null

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(payloadBase64)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function isTokenExpired(token) {
  const payload = decodeJwtPayload(token)

  if (!payload || typeof payload.exp !== 'number') {
    return true
  }

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return payload.exp <= nowInSeconds
}

function getAuthSession() {
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  let user = null
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    user = null
  }

  const hasValidRole = role === 'admin' || role === 'member'
  const hasUserId = Boolean(user && (user.id || user._id))
  const valid = Boolean(token) && hasValidRole && hasUserId && !isTokenExpired(token)

  return {
    token,
    role,
    user,
    valid,
  }
}

function requireValidSession() {
  const session = getAuthSession()

  if (!session.valid) {
    clearAuthSession()
  }

  return session
}

export {
  clearAuthSession,
  getAuthSession,
  isTokenExpired,
  requireValidSession,
}
