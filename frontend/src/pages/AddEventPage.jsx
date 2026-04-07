import { useEffect, useState } from 'react'
import API from '../api/axios'
import FormInput from '../components/FormInput'
import PageWrapper from '../components/PageWrapper'

function toDateTimeLocal(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (n) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const mins = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${mins}`
}

const initialForm = { title: '', description: '', eventDate: '', location: '' }

function AddEventPage() {
  const [form, setForm] = useState(initialForm)
  const [thumbnail, setThumbnail] = useState(null)
  const [images, setImages] = useState([])
  const [events, setEvents] = useState([])
  const [editingEventId, setEditingEventId] = useState('')
  const [eventsLoading, setEventsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const isEditing = Boolean(editingEventId)

  async function loadEvents() {
    try {
      setEventsLoading(true)
      const { data } = await API.get('/events')
      const fetchedEvents = Array.isArray(data?.data) ? data.data : []
      setEvents(fetchedEvents)
    } catch {
      setEvents([])
    } finally {
      setEventsLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  function resetForm() {
    setForm(initialForm)
    setThumbnail(null)
    setImages([])
    setEditingEventId('')
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleEdit(event) {
    setMessage('')
    setError('')
    setEditingEventId(event._id)
    setForm({
      title: event.title || '',
      description: event.description || '',
      eventDate: toDateTimeLocal(event.eventDate),
      location: event.location || '',
    })
    setThumbnail(null)
    setImages([])
  }

  async function handleDelete(eventId) {
    setMessage('')
    setError('')
    try {
      setActionLoading(true)
      await API.delete(`/events/${eventId}`)
      setMessage('Event deleted successfully')
      if (editingEventId === eventId) {
        resetForm()
      }
      await loadEvents()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete event')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!form.title || !form.eventDate) {
      setError('Title and Event Date are required')
      return
    }

    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => payload.append(key, value))

    if (thumbnail) payload.append('thumbnail', thumbnail)
    Array.from(images).forEach((img) => payload.append('images', img))

    try {
      setActionLoading(true)
      const { data } = isEditing
        ? await API.patch(`/events/${editingEventId}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await API.post('/events', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
      setMessage(data?.message || (isEditing ? 'Event updated' : 'Event created'))
      resetForm()
      await loadEvents()
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} event`)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Manage Events</h1>
      <p className="mt-2 text-sm text-slate-300">Admins can create, update, and delete any event.</p>

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

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button disabled={actionLoading} className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 font-semibold text-white disabled:opacity-60">
            {isEditing ? 'Update Event' : 'Publish Event'}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">Existing Events</h2>
        {eventsLoading ? (
          <p className="mt-3 text-sm text-slate-300">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="mt-3 text-sm text-slate-300">No events found.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <article key={event._id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-white">{event.title}</h3>
                    <p className="mt-1 text-xs text-slate-300">
                      {event.eventDate ? new Date(event.eventDate).toLocaleString() : 'No date'}
                      {event.location ? ` • ${event.location}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleEdit(event)}
                      className="rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-100 disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleDelete(event._id)}
                      className="rounded-lg border border-rose-300/40 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-100 disabled:opacity-60"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  )
}

export default AddEventPage
