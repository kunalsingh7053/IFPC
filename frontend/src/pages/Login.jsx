import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import PageWrapper from '../components/PageWrapper'

const MEDICAPS_EMAIL_DOMAIN = '@medicaps.ac.in'
const isMedicapsEmail = (email = '') =>
  email.trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN)

function Login() {
  const navigate = useNavigate()

  const [role, setRole] = useState('admin')
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [registrationOpen, setRegistrationOpen] = useState(false)

  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    position: 'member',
    department: '',
  })

  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerMessage, setRegisterMessage] = useState('')
  const [registerError, setRegisterError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const { data } = await API.get('/auth/member-registration-status')
        setRegistrationOpen(Boolean(data?.data?.memberRegistrationOpen))
      } catch {}
    }
    load()
  }, [])

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleRegisterChange = (e) =>
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value })

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isMedicapsEmail(form.email)) {
      setError('Only @medicaps.ac.in email allowed')
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
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setRegisterLoading(true)
    setRegisterError('')
    setRegisterMessage('')

    const { firstName, lastName, email, password, phone } = registerForm

    if (!firstName || !lastName || !email || !password || !phone) {
      setRegisterError('All fields including phone are required')
      setRegisterLoading(false)
      return
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setRegisterError('Invalid phone number')
      setRegisterLoading(false)
      return
    }

    try {
      const { data } = await API.post('/users/register', registerForm)
      setRegisterMessage(data.message)

      setRegisterForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        position: 'member',
        department: '',
      })
    } catch (err) {
      setRegisterError(err?.response?.data?.message || 'Failed')
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <PageWrapper>
      <div className="auth-shell min-h-screen px-4 py-8 flex items-center justify-center">

        <div className="auth-card auth-animate-in grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl lg:grid-cols-2">

          {/* LEFT PANEL */}
          <div className="login-side-panel relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
                IFPC Portal
              </p>

              <h1 className="mt-6 max-w-md text-4xl font-bold leading-tight">
                Register and sign in with a cleaner, smarter campus workflow.
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/80">
                Manage members, events, and communication from one polished dashboard designed to match the IFPC experience.
              </p>

              <ul className="mt-8 space-y-3 text-sm text-white/90">
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.85)]" />
                  Secure role-based access
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-lime-300 shadow-[0_0_18px_rgba(190,242,100,0.8)]" />
                  Fast dashboard entry
                </li>
                <li className="flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.8)]" />
                  Medicaps email verification
                </li>
              </ul>
            </div>

            <div className="mt-10 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-white/85 backdrop-blur-sm">
              Tip: Use the member role when creating student accounts, and switch to admin for dashboard access.
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="login-form-panel p-6 sm:p-8 lg:p-10">

            <div className="mb-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-emerald-400/40 hover:bg-white/10 hover:text-white"
              >
                <span aria-hidden="true">←</span>
                Back
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm font-medium text-emerald-300 hover:text-emerald-200"
              >
                Home
              </button>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/90">
                Access Center
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Welcome back to IFPC
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-300">
                Sign in as admin or member, or register a new account when registration is open.
              </p>
            </div>

            {/* ROLE SWITCH */}
            <div className="mb-6 flex rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold ${role === 'admin' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-300 hover:text-white'}`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole('member')}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold ${role === 'member' ? 'bg-lime-500 text-slate-950 shadow-lg shadow-lime-500/25' : 'text-slate-300 hover:text-white'}`}
              >
                Member
              </button>
            </div>

            {/* LOGIN */}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20"
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20"
              />

              <button className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.01]">
                {loading ? 'Signing...' : 'Login'}
              </button>
            </form>

            {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

            {/* REGISTER */}
            {registrationOpen && (
              <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="mb-5">
                  <h3 className="text-xl font-semibold text-white">Register</h3>
                  <p className="mt-1 text-sm text-slate-400">Create your IFPC account with your Medicaps email.</p>
                </div>

                <form onSubmit={handleRegister} className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <input name="firstName" placeholder="First Name" value={registerForm.firstName} onChange={handleRegisterChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20" />
                  <input name="lastName" placeholder="Last Name" value={registerForm.lastName} onChange={handleRegisterChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20" />

                  <input name="email" placeholder="Email" value={registerForm.email} onChange={handleRegisterChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20 sm:col-span-2" />
                  <input name="password" type="password" placeholder="Password" value={registerForm.password} onChange={handleRegisterChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20 sm:col-span-2" />

                  <input name="phone" placeholder="Phone Number" value={registerForm.phone} onChange={handleRegisterChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20 sm:col-span-2" />

                  <select
                    name="position"
                    value={registerForm.position}
                    onChange={handleRegisterChange}
                    className="auth-select w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-emerald-400/60 focus:bg-slate-950/80 focus:ring-2 focus:ring-emerald-400/20 sm:col-span-2"
                  >
                    <option value="member">Member</option>
                    <option value="core">Core</option>
                    <option value="head">Head</option>
                    <option value="vice-president">Vice President</option>
                    <option value="president">President</option>
                  </select>

                  <input
                    name="department"
                    placeholder="Department"
                    value={registerForm.department}
                    onChange={handleRegisterChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-emerald-400/20 sm:col-span-2"
                  />

                  <button className="sm:col-span-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 py-3 font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 hover:scale-[1.01]">
                    {registerLoading ? 'Submitting...' : 'Register'}
                  </button>

                </form>

                {registerError && <p className="mt-3 text-sm text-rose-300">{registerError}</p>}
                {registerMessage && <p className="mt-3 text-sm text-emerald-300">{registerMessage}</p>}
              </div>
            )}

            {!registrationOpen && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                Registration is currently closed by admin.
              </div>
            )}

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default Login