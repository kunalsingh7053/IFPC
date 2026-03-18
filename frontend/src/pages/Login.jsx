import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import FormInput from '../components/FormInput'
import PageWrapper from '../components/PageWrapper'

const MEDICAPS_EMAIL_DOMAIN = '@medicaps.ac.in'
const isMedicapsEmail = (email = '') => email.trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN)

function Login() {
  const navigate = useNavigate()
  const [role, setRole] = useState('admin')
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isMedicapsEmail(form.email)) {
      setError('Only @medicaps.ac.in email is allowed')
      setLoading(false)
      return
    }

    try {
      const endpoint = role === 'admin' ? '/auth/login' : '/users/login'
      const { data } = await API.post(endpoint, form)

      const token = role === 'admin' ? data?.adminToken : data?.memberToken
      const user = role === 'admin' ? data?.admin : data?.user

      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('user', JSON.stringify(user))

      navigate(role === 'admin' ? '/admin-dashboard' : '/member-dashboard')
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      const validationMessage = err?.response?.data?.errors?.[0]?.msg
      setError(apiMessage || validationMessage || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <section className="auth-shell mx-auto flex min-h-[78vh] w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 md:py-12">
        <div className="auth-card auth-animate-in w-full max-w-lg rounded-3xl border border-white/15 p-5 sm:p-7 md:p-8">
          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/20"
            >
              Back
            </button>
            <Link
              to="/"
              className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 hover:bg-cyan-500/20"
            >
              Home
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">Login</h1>
          <p className="mt-2 text-sm text-slate-300">Sign in as Admin or Member</p>
          <p className="mt-1 text-xs text-cyan-200/90">Use your Medicaps email only ({MEDICAPS_EMAIL_DOMAIN})</p>

          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-950/45 p-1.5">
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`rounded-xl py-2.5 text-sm font-semibold ${role === 'admin' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'text-slate-300 hover:bg-white/10'}`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRole('member')}
              className={`rounded-xl py-2.5 text-sm font-semibold ${role === 'member' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-300 hover:bg-white/10'}`}
            >
              Member
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />

            <button className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(34,211,238,0.28)] hover:brightness-110" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

          <p className="mt-4 text-sm text-slate-300">
            New member? <Link to="/register" className="text-cyan-300">Register here</Link>
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default Login
