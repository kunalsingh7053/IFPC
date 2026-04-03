import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import FormInput from '../components/FormInput'
import PageWrapper from '../components/PageWrapper'

const MEDICAPS_EMAIL_DOMAIN = '@medicaps.ac.in'
const isMedicapsEmail = (email = '') => email.trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN)

function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    position: 'member',
    department: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!isMedicapsEmail(form.email)) {
      setError('Only @medicaps.ac.in email is allowed')
      setLoading(false)
      return
    }

    try {
      const { data } = await API.post('/users/register', form)
      setMessage(data?.message || 'Registered successfully')
      setForm({ firstName: '', lastName: '', email: '', password: '', position: 'member', department: '' })
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <section className="auth-shell mx-auto flex min-h-[78vh] w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 md:py-12">
        <div className="auth-card auth-animate-in w-full max-w-3xl rounded-3xl border border-white/15 p-5 sm:p-7 md:p-8">
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
              className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/20"
            >
              Home
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">Member Registration</h1>
          <p className="mt-2 text-sm text-slate-300">Create your IFPC member account</p>
          <p className="mt-1 text-xs text-emerald-200/90">Use your Medicaps email only ({MEDICAPS_EMAIL_DOMAIN})</p>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
            <FormInput label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
            <FormInput label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
            <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
            <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
            <FormInput label="Position" name="position" value={form.position} onChange={handleChange} />
            <FormInput label="Department" name="department" value={form.department} onChange={handleChange} />

            <button className="md:col-span-2 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 py-3 font-semibold text-white shadow-[0_10px_30px_rgba(34,211,238,0.28)] hover:brightness-110" disabled={loading}>
              {loading ? 'Submitting...' : 'Register'}
            </button>
          </form>

          {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
          {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}

          <p className="mt-4 text-sm text-slate-300">
            Already have an account? <Link to="/login" className="text-emerald-300">Login</Link>
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default Register
