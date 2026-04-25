import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import FormInput from '../components/FormInput'
import PageWrapper from '../components/PageWrapper'

const MEDICAPS_EMAIL_DOMAIN = '@medicaps.ac.in'
const isMedicapsEmail = (email = '') =>
  email.trim().toLowerCase().endsWith(MEDICAPS_EMAIL_DOMAIN)

function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    position: '',
    department: '',
  })

  const [loading, setLoading] = useState(false)
  const [gateLoading, setGateLoading] = useState(true)
  const [registrationOpen, setRegistrationOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRegistrationStatus() {
      try {
        setGateLoading(true)
        const { data } = await API.get('/auth/member-registration-status')
        setRegistrationOpen(Boolean(data?.data?.memberRegistrationOpen))
      } catch {
        setRegistrationOpen(false)
      } finally {
        setGateLoading(false)
      }
    }

    loadRegistrationStatus()
  }, [])

  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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

    if (!form.position) {
      setError('Please select your position')
      setLoading(false)
      return
    }

    try {
      const { data } = await API.post('/users/register', form)

      setMessage(data?.message || 'Registered successfully')

      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        position: '',
        department: '',
      })
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <section className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center justify-center px-4 py-10">

        <div className="w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-8 shadow-2xl">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-slate-300 hover:text-white"
            >
              ← Back
            </button>

            <Link to="/" className="text-emerald-400 text-sm">
              Home
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Member Registration
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Create your IFPC account
          </p>

          {/* STATUS */}
          {gateLoading ? (
            <p className="mt-6 text-slate-400">
              Checking availability...
            </p>
          ) : !registrationOpen ? (
            <div className="mt-6 bg-red-500/10 border border-red-400/30 p-4 rounded-xl text-red-300">
              Registration is closed by admin
            </div>
          ) : (
            <>
              <div className="mt-6 bg-emerald-500/10 border border-emerald-400/30 p-3 rounded-xl text-emerald-300 text-sm">
                Registration is open
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >

                <FormInput
                  label="First Name"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Last Name"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />

                {/* 🔥 POSITION DROPDOWN (ONLY 3 VALUES) */}
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-200 mb-1">
                    Position in IFPC
                  </label>

                  <select
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition"
                  >
                    <option value="" disabled>
                      Select Position
                    </option>

                    <option value="member">member</option>
                    <option value="core">core</option>
                    <option value="head">head</option>
                  </select>
                </div>

                <FormInput
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                />

                {/* SUBMIT */}
                <button
                  className="md:col-span-2 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 py-3 font-semibold text-white hover:scale-[1.02] transition"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Register'}
                </button>
              </form>
            </>
          )}

          {/* MESSAGES */}
          {error && (
            <p className="mt-3 text-red-400 text-sm">{error}</p>
          )}

          {message && (
            <p className="mt-3 text-emerald-400 text-sm">{message}</p>
          )}

          {/* FOOTER */}
          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400">
              Login
            </Link>
          </p>

        </div>
      </section>
    </PageWrapper>
  )
}

export default Register