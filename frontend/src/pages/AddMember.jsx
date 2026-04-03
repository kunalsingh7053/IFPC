import { useState } from 'react'
import API from '../api/axios'
import FormInput from '../components/FormInput'
import PageWrapper from '../components/PageWrapper'

function AddMember() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    position: 'member',
    department: '',
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const { data } = await API.post('/users/register', form)
      setMessage(data?.message || 'Member added')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add member')
    }
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Add Member</h1>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
        <FormInput label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required />
        <FormInput label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required />
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        <FormInput label="Password" name="password" type="password" value={form.password} onChange={handleChange} required />
        <FormInput label="Position" name="position" value={form.position} onChange={handleChange} />
        <FormInput label="Department" name="department" value={form.department} onChange={handleChange} />

        <button className="md:col-span-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 py-3 font-semibold text-white">
          Add Member
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </PageWrapper>
  )
}

export default AddMember
