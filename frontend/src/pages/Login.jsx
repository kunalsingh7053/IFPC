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
      <section className="auth-shell mx-auto flex min-h-[78vh] w-full max-w-6xl items-center justify-center px-3 py-7 sm:px-6 md:py-12">
        <div className="auth-card auth-animate-in w-full max-w-4xl rounded-3xl border border-white/15 p-4 sm:p-6 md:p-8">
          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.15fr] lg:gap-6">
            <aside className="login-side-panel rounded-2xl border border-white/12 p-5 sm:p-6">
              <p className="inline-flex rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-100">
                IFPC Portal Access
              </p>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">Welcome Back</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Continue as Admin or Member to manage events, members, and communication from one dashboard.
              </p>

              <div className="mt-4 space-y-2.5 text-sm text-slate-200/95">
                <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Secure sign-in with role-based access</p>
                <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Fast access to your dashboard tools</p>
                <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Only Medicaps email allowed ({MEDICAPS_EMAIL_DOMAIN})</p>
              </div>
            </aside>

            <div className="login-form-panel rounded-2xl border border-white/12 p-4 sm:p-5 md:p-6">
              <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/20 sm:w-auto"
                >
                  Back
                </button>
                <Link
                  to="/"
                  className="w-full rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-center text-sm font-medium text-emerald-200 hover:bg-emerald-500/20 sm:w-auto"
                >
                  Home
                </Link>
              </div>

              <h2 className="text-2xl font-bold text-white sm:text-3xl">Login</h2>
              <p className="mt-1 text-sm text-slate-300">Sign in as Admin or Member</p>

              <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-slate-950/45 p-1.5">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`rounded-xl py-2.5 text-sm font-semibold ${role === 'admin' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'text-slate-300 hover:bg-white/10'}`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('member')}
                  className={`rounded-xl py-2.5 text-sm font-semibold ${role === 'member' ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-slate-300 hover:bg-white/10'}`}
                >
                  Member
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />

                <button className="mt-2 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(34,211,238,0.28)] hover:brightness-110" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

              <p className="mt-4 text-sm text-slate-300">
                New member? <Link to="/register" className="font-semibold text-emerald-300">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

export default Login
