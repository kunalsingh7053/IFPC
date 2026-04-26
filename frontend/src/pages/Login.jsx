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
      <div className="min-h-screen flex items-center justify-center px-4">

        <div className="grid lg:grid-cols-2 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-white/10">

          {/* LEFT PANEL */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-10 hidden lg:flex flex-col justify-center">
            <h1 className="text-3xl font-bold">IFPC Portal</h1>
            <p className="mt-4 text-sm opacity-90">
              Manage members, events, and communication in one place.
            </p>

            <ul className="mt-6 space-y-2 text-sm">
              <li>✔ Secure role-based login</li>
              <li>✔ Fast dashboard access</li>
              <li>✔ Only Medicaps email allowed</li>
            </ul>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-[#0f172a] p-8">

            {/* ROLE SWITCH */}
            <div className="flex bg-white/10 rounded-xl p-1 mb-6">
              <button
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 rounded-lg ${role === 'admin' ? 'bg-emerald-500 text-white' : 'text-gray-300'}`}
              >
                Admin
              </button>
              <button
                onClick={() => setRole('member')}
                className={`flex-1 py-2 rounded-lg ${role === 'member' ? 'bg-green-500 text-white' : 'text-gray-300'}`}
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
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-white outline-none"
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl bg-white/10 text-white outline-none"
              />

              <button className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold">
                {loading ? 'Signing...' : 'Login'}
              </button>
            </form>

            {error && <p className="text-red-400 mt-2">{error}</p>}

            {/* REGISTER */}
            {registrationOpen && (
              <div className="mt-10 border-t border-white/10 pt-6">
                <h3 className="text-white mb-4">Register</h3>

                <form onSubmit={handleRegister} className="grid grid-cols-2 gap-3">

                  <input name="firstName" placeholder="First Name" value={registerForm.firstName} onChange={handleRegisterChange} className="input" />
                  <input name="lastName" placeholder="Last Name" value={registerForm.lastName} onChange={handleRegisterChange} className="input" />

                  <input name="email" placeholder="Email" value={registerForm.email} onChange={handleRegisterChange} className="col-span-2 input" />
                  <input name="password" type="password" placeholder="Password" value={registerForm.password} onChange={handleRegisterChange} className="col-span-2 input" />

                  <input name="phone" placeholder="Phone Number" value={registerForm.phone} onChange={handleRegisterChange} className="col-span-2 input" />

                  <button className="col-span-2 py-2 rounded-xl bg-blue-500 text-white">
                    {registerLoading ? 'Submitting...' : 'Register'}
                  </button>

                </form>

                {registerError && <p className="text-red-400 mt-2">{registerError}</p>}
                {registerMessage && <p className="text-green-400 mt-2">{registerMessage}</p>}
              </div>
            )}

          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default Login