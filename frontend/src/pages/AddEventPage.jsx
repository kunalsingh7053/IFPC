import { useState } from 'react'
import API from '../api/axios'
import FormInput from '../components/FormInput'
import PageWrapper from '../components/PageWrapper'

function AddEventPage() {
  const [form, setForm] = useState({ title: '', description: '', eventDate: '', location: '' })
  const [thumbnail, setThumbnail] = useState(null)
  const [images, setImages] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => payload.append(key, value))

    if (thumbnail) payload.append('thumbnail', thumbnail)
    Array.from(images).forEach((img) => payload.append('images', img))

    try {
      const { data } = await API.post('/events', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage(data?.message || 'Event created')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create event')
    }
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Add Event</h1>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-2">
        <FormInput label="Title" name="title" value={form.title} onChange={handleChange} required />
        <FormInput label="Event Date" name="eventDate" type="datetime-local" value={form.eventDate} onChange={handleChange} required />
        <FormInput label="Location" name="location" value={form.location} onChange={handleChange} />

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-200">Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="min-h-24 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Thumbnail</span>
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0])} className="w-full text-sm text-slate-200" />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-200">Gallery Images</span>
          <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files || [])} className="w-full text-sm text-slate-200" />
        </label>

        <button className="md:col-span-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 py-3 font-semibold text-white">
          Publish Event
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </PageWrapper>
  )
}

export default AddEventPage
