import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import API from '../api/axios'

const initialEventForm = { title: '', description: '', eventDate: '', location: '' }
const initialEquipmentForm = { name: '', category: 'camera', imageUrl: '' }

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

function formatDateTime(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString()
}

function issueStatusStyle(status) {
  const styles = {
    pending: 'border-amber-300/40 bg-amber-500/20 text-amber-100',
    approved: 'border-emerald-300/40 bg-emerald-500/20 text-emerald-100',
    rejected: 'border-rose-300/40 bg-rose-500/20 text-rose-100',
    received: 'border-sky-300/40 bg-sky-500/20 text-sky-100',
    returned: 'border-violet-300/40 bg-violet-500/20 text-violet-100',
  }
  return styles[status] || 'border-white/20 bg-white/10 text-slate-100'
}

function AdminDashboard() {
  const [activePanel, setActivePanel] = useState('overview')

  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)
  const [eventsListError, setEventsListError] = useState('')
  const [eventForm, setEventForm] = useState(initialEventForm)
  const [eventThumbnail, setEventThumbnail] = useState(null)
  const [eventImages, setEventImages] = useState([])
  const [editingEventId, setEditingEventId] = useState('')
  const [eventActionLoading, setEventActionLoading] = useState(false)
  const [eventMessage, setEventMessage] = useState('')
  const [eventError, setEventError] = useState('')

  const [equipment, setEquipment] = useState([])
  const [equipmentLoading, setEquipmentLoading] = useState(false)
  const [equipmentListError, setEquipmentListError] = useState('')
  const [equipmentForm, setEquipmentForm] = useState(initialEquipmentForm)
  const [editingEquipmentId, setEditingEquipmentId] = useState('')
  const [equipmentActionLoading, setEquipmentActionLoading] = useState(false)
  const [equipmentMessage, setEquipmentMessage] = useState('')
  const [equipmentError, setEquipmentError] = useState('')

  const [equipmentIssues, setEquipmentIssues] = useState([])
  const [equipmentIssuesLoading, setEquipmentIssuesLoading] = useState(false)
  const [equipmentIssuesError, setEquipmentIssuesError] = useState('')
  const [equipmentIssuesActionLoading, setEquipmentIssuesActionLoading] = useState(false)
  const [equipmentIssuesMessage, setEquipmentIssuesMessage] = useState('')

  const [memberRegistrationOpen, setMemberRegistrationOpen] = useState(false)
  const [registrationStatusLoading, setRegistrationStatusLoading] = useState(false)
  const [registrationStatusMessage, setRegistrationStatusMessage] = useState('')

  useEffect(() => {
    let mounted = true

    async function loadStats() {
      try {
        setStatsLoading(true)
        setStatsError('')
        const response = await API.get('/auth/dashboard-stats')
        if (mounted) setStats(response.data?.data || null)
      } catch (err) {
        if (mounted) {
          setStatsError(err?.response?.data?.message || 'Failed to load dashboard stats')
        }
      } finally {
        if (mounted) setStatsLoading(false)
      }
    }

    loadStats()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    loadEvents()
    loadEquipment()
    loadEquipmentIssues()
    loadRegistrationStatus()
  }, [])

  async function loadEvents() {
    try {
      setEventsLoading(true)
      setEventsListError('')
      const { data } = await API.get('/events')
      setEvents(Array.isArray(data?.data) ? data.data : [])
    } catch (err) {
      setEvents([])
      setEventsListError(err?.response?.data?.message || 'Failed to load events')
    } finally {
      setEventsLoading(false)
    }
  }

  async function loadEquipment() {
    try {
      setEquipmentLoading(true)
      setEquipmentListError('')
      const { data } = await API.get('/equipment')
      setEquipment(Array.isArray(data?.data) ? data.data : [])
    } catch (err) {
      setEquipment([])
      setEquipmentListError(err?.response?.data?.message || 'Failed to load equipment')
    } finally {
      setEquipmentLoading(false)
    }
  }

  async function refreshAll() {
    await Promise.all([loadEvents(), loadEquipment(), loadEquipmentIssues(), loadRegistrationStatus()])
  }

  async function loadRegistrationStatus() {
    try {
      setRegistrationStatusLoading(true)
      const { data } = await API.get('/auth/member-registration-status')
      setMemberRegistrationOpen(Boolean(data?.data?.memberRegistrationOpen))
    } catch {
      setMemberRegistrationOpen(false)
    } finally {
      setRegistrationStatusLoading(false)
    }
  }

  async function toggleMemberRegistrationStatus() {
    try {
      setRegistrationStatusLoading(true)
      setRegistrationStatusMessage('')
      const nextValue = !memberRegistrationOpen
      const { data } = await API.patch('/auth/member-registration-status', {
        memberRegistrationOpen: nextValue,
      })
      setMemberRegistrationOpen(Boolean(data?.data?.memberRegistrationOpen))
      setRegistrationStatusMessage(data?.message || 'Registration status updated')
    } catch (err) {
      setRegistrationStatusMessage(err?.response?.data?.message || 'Failed to update registration status')
    } finally {
      setRegistrationStatusLoading(false)
    }
  }

  async function loadEquipmentIssues() {
    try {
      setEquipmentIssuesLoading(true)
      setEquipmentIssuesError('')
      const { data } = await API.get('/equipment-issues/admin')
      setEquipmentIssues(Array.isArray(data?.data) ? data.data : [])
    } catch (err) {
      setEquipmentIssues([])
      setEquipmentIssuesError(err?.response?.data?.message || 'Failed to load equipment issue requests')
    } finally {
      setEquipmentIssuesLoading(false)
    }
  }

  async function updateIssueStatus(issueId, status) {
    const adminNote = window.prompt(`Optional note for status: ${status}`, '') ?? ''

    try {
      setEquipmentIssuesActionLoading(true)
      setEquipmentIssuesMessage('')
      await API.patch(`/equipment-issues/admin/${issueId}/status`, {
        status,
        adminNote,
      })
      setEquipmentIssuesMessage(`Issue marked as ${status}`)
      await loadEquipmentIssues()
    } catch (err) {
      setEquipmentIssuesError(err?.response?.data?.message || `Failed to mark ${status}`)
    } finally {
      setEquipmentIssuesActionLoading(false)
    }
  }

  function resetEventForm() {
    setEventForm(initialEventForm)
    setEditingEventId('')
    setEventThumbnail(null)
    setEventImages([])
  }

  function handleThumbnailSelection(e) {
    const file = e.target.files?.[0] || null
    setEventThumbnail(file)
  }

  function handleGallerySelection(e) {
    const files = Array.from(e.target.files || [])
    if (files.length > 5) {
      setEventError('Maximum 5 gallery images allowed. First 5 selected.')
    }
    setEventImages(files.slice(0, 5))
  }

  function handleEventEdit(event) {
    setEventMessage('')
    setEventError('')
    setEditingEventId(event._id)
    setEventForm({
      title: event.title || '',
      description: event.description || '',
      eventDate: toDateTimeLocal(event.eventDate),
      location: event.location || '',
    })
    setEventThumbnail(null)
    setEventImages([])
    setActivePanel('events')
  }

  async function handleEventDelete(eventId) {
    setEventMessage('')
    setEventError('')
    try {
      setEventActionLoading(true)
      await API.delete(`/events/${eventId}`)
      setEventMessage('Event deleted successfully')
      if (editingEventId === eventId) resetEventForm()
      await loadEvents()
    } catch (err) {
      setEventError(err?.response?.data?.message || 'Failed to delete event')
    } finally {
      setEventActionLoading(false)
    }
  }

  async function handleEventSubmit(e) {
    e.preventDefault()
    setEventMessage('')
    setEventError('')

    if (!eventForm.title || !eventForm.eventDate) {
      setEventError('Title and Event Date are required')
      return
    }

    const payload = new FormData()
    Object.entries(eventForm).forEach(([key, value]) => payload.append(key, value))
    if (eventThumbnail) payload.append('thumbnail', eventThumbnail)
    Array.from(eventImages).forEach((img) => payload.append('images', img))

    try {
      setEventActionLoading(true)
      const { data } = editingEventId
        ? await API.patch(`/events/${editingEventId}`, payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await API.post('/events', payload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })

      setEventMessage(data?.message || (editingEventId ? 'Event updated' : 'Event created'))
      resetEventForm()
      await loadEvents()
    } catch (err) {
      setEventError(err?.response?.data?.message || `Failed to ${editingEventId ? 'update' : 'create'} event`)
    } finally {
      setEventActionLoading(false)
    }
  }

  function resetEquipmentForm() {
    setEquipmentForm(initialEquipmentForm)
    setEditingEquipmentId('')
  }

  function handleEquipmentEdit(item) {
    setEquipmentMessage('')
    setEquipmentError('')
    setEditingEquipmentId(item._id)
    setEquipmentForm({
      name: item.name || '',
      category: item.category || 'camera',
      imageUrl: item.imageUrl || '',
    })
    setActivePanel('equipment')
  }

  async function handleEquipmentSubmit(e) {
    e.preventDefault()
    setEquipmentMessage('')
    setEquipmentError('')

    if (!equipmentForm.name || !equipmentForm.category || !equipmentForm.imageUrl) {
      setEquipmentError('Name, category and image URL are required')
      return
    }

    try {
      setEquipmentActionLoading(true)
      const payload = {
        name: equipmentForm.name,
        category: equipmentForm.category,
        imageUrl: equipmentForm.imageUrl,
      }

      const { data } = editingEquipmentId
        ? await API.patch(`/equipment/${editingEquipmentId}`, payload)
        : await API.post('/equipment', payload)

      setEquipmentMessage(data?.message || (editingEquipmentId ? 'Equipment updated' : 'Equipment added'))
      resetEquipmentForm()
      await loadEquipment()
    } catch (err) {
      setEquipmentError(err?.response?.data?.message || `Failed to ${editingEquipmentId ? 'update' : 'add'} equipment`)
    } finally {
      setEquipmentActionLoading(false)
    }
  }

  const positionCards = useMemo(() => {
    if (!stats?.positionCounts) return []

    return Object.entries(stats.positionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([position, count]) => ({
        title: position.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        value: count,
      }))
  }, [stats])

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b?.eventDate || 0).getTime() - new Date(a?.eventDate || 0).getTime())
  }, [events])

  const topCards = [
    { title: 'Total Members', value: stats?.totalMembers ?? 0 },
    { title: 'Core Members', value: stats?.coreMembers ?? 0 },
    { title: 'Head Members', value: stats?.headMembers ?? 0 },
    { title: 'Total Events', value: stats?.totalEvents ?? 0 },
    { title: 'Events Covered', value: stats?.eventsCovered ?? 0 },
    { title: 'Upcoming Events', value: stats?.upcomingEvents ?? 0 },
  ]

  const adminPowers = [
    'Manage member records and approvals',
    'Create and update events from this dashboard',
    'Create and update equipment from this dashboard',
    'Delete events and moderate chat content',
    'Monitor active and approved member counts',
  ]

  const panelButtonClass = (panel) =>
    `rounded-xl px-4 py-2 text-sm font-semibold transition ${
      activePanel === panel
        ? 'bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.35)]'
        : 'border border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
    }`

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6">
      <section className="rounded-3xl border border-white/10 bg-slate-950/55 p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Control Center</p>
            <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">Admin Dashboard</h1>
          </div>
          <button
            type="button"
            onClick={refreshAll}
            className="rounded-xl border border-emerald-300/35 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100"
          >
            Refresh Data
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button type="button" className={panelButtonClass('overview')} onClick={() => setActivePanel('overview')}>
            Overview
          </button>
          <button type="button" className={panelButtonClass('events')} onClick={() => setActivePanel('events')}>
            Events Management
          </button>
          <button type="button" className={panelButtonClass('equipment')} onClick={() => setActivePanel('equipment')}>
            Equipment Management
          </button>
        </div>
      </section>

      {activePanel === 'overview' && (
        <>
          {statsLoading && <p className="mt-4 text-sm text-slate-300">Loading dashboard data...</p>}

          {statsError && (
            <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{statsError}</p>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {topCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-medium uppercase tracking-wide text-slate-300">{card.title}</h3>
                <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Members by Position</h2>
              {positionCards.length === 0 ? (
                <p className="mt-3 text-sm text-slate-300">No member distribution data found.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {positionCards.map((item) => (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-slate-900/30 px-4 py-3">
                      <p className="text-sm text-slate-300">{item.title}</p>
                      <p className="text-2xl font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Admin Powers</h2>
              <ul className="mt-4 space-y-3">
                {adminPowers.map((power) => (
                  <li key={power} className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {power}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">Member Registration Gate</h2>
                <p className="mt-1 text-sm text-slate-300">Open or close member registration from single /register route.</p>
              </div>
              <span
                className={`rounded-lg border px-3 py-1 text-xs font-semibold uppercase ${
                  memberRegistrationOpen
                    ? 'animate-pulse border-emerald-300/50 bg-emerald-500/20 text-emerald-100'
                    : 'border-rose-300/40 bg-rose-500/20 text-rose-100'
                }`}
              >
                {memberRegistrationOpen ? 'Open' : 'Closed'}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={registrationStatusLoading}
                onClick={toggleMemberRegistrationStatus}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {registrationStatusLoading
                  ? 'Updating...'
                  : memberRegistrationOpen
                  ? 'Close Registration'
                  : 'Open Registration'}
              </button>
              {registrationStatusMessage ? <p className="text-sm text-slate-200">{registrationStatusMessage}</p> : null}
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-white">Members & Chat (Single Admin Entry)</h2>
            <p className="mt-1 text-sm text-slate-300">Use this dashboard route as single entry to open members and chat management.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/members"
                className="rounded-xl border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100"
              >
                Open Members
              </Link>
              <Link
                to="/member-dashboard/chat"
                className="rounded-xl border border-sky-300/40 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-100"
              >
                Open Chat
              </Link>
            </div>
          </section>
        </>
      )}

      {activePanel === 'events' && (
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Event Management (Only in Dashboard)</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-300">Total: {events.length}</span>
              {editingEventId && (
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleEventSubmit} className="grid gap-4 md:grid-cols-2">
            <input
              value={eventForm.title}
              onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Event title"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
              required
            />
            <input
              type="datetime-local"
              value={eventForm.eventDate}
              onChange={(e) => setEventForm((prev) => ({ ...prev, eventDate: e.target.value }))}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
              required
            />
            <input
              value={eventForm.location}
              onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Location"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
            />

            <label className="rounded-xl border border-white/15 bg-white/10 p-4 text-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Thumbnail Upload</p>
              <p className="mt-1 text-xs text-slate-400">Choose one image for event cover.</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelection}
                className="mt-3 w-full text-sm text-slate-200 outline-none"
              />
              <p className="mt-2 text-xs text-slate-300">
                {eventThumbnail ? `Selected: ${eventThumbnail.name}` : 'No thumbnail selected'}
              </p>
            </label>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              className="min-h-24 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none md:col-span-2"
            />
            <label className="rounded-xl border border-white/15 bg-white/10 p-4 text-slate-100 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Gallery Upload</p>
              <p className="mt-1 text-xs text-slate-400">Choose multiple gallery images (max 5).</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGallerySelection}
                className="mt-3 w-full text-sm text-slate-200 outline-none"
              />
              <p className="mt-2 text-xs text-slate-300">
                {eventImages.length > 0 ? `${eventImages.length} gallery image(s) selected` : 'No gallery images selected'}
              </p>
              {eventImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {eventImages.map((file) => (
                    <span key={file.name + file.size} className="rounded-lg border border-white/15 bg-slate-900/40 px-2 py-1 text-[11px] text-slate-200">
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </label>
            <button
              type="submit"
              disabled={eventActionLoading}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 font-semibold text-white disabled:opacity-60 md:col-span-2"
            >
              {eventActionLoading ? 'Saving...' : editingEventId ? 'Update Event' : 'Create Event'}
            </button>
          </form>

          {eventError && <p className="mt-3 text-sm text-rose-300">{eventError}</p>}
          {eventMessage && <p className="mt-3 text-sm text-emerald-300">{eventMessage}</p>}
          {eventsListError && <p className="mt-3 text-sm text-rose-300">{eventsListError}</p>}

          <div className="mt-5 space-y-3">
            {eventsLoading ? (
              <p className="text-sm text-slate-300">Loading events...</p>
            ) : sortedEvents.length === 0 ? (
              <p className="text-sm text-slate-300">No events found.</p>
            ) : (
              sortedEvents.map((event) => (
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
                        disabled={eventActionLoading}
                        onClick={() => handleEventEdit(event)}
                        className="rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-100 disabled:opacity-60"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={eventActionLoading}
                        onClick={() => handleEventDelete(event._id)}
                        className="rounded-lg border border-rose-300/40 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-100 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {activePanel === 'equipment' && (
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Equipment Management (Only in Dashboard)</h2>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-slate-300">Total: {equipment.length}</span>
              {editingEquipmentId && (
                <button
                  type="button"
                  onClick={resetEquipmentForm}
                  className="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleEquipmentSubmit} className="grid gap-3 md:grid-cols-3">
            <input
              value={equipmentForm.name}
              onChange={(e) => setEquipmentForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Equipment name"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
              required
            />
            <select
              value={equipmentForm.category}
              onChange={(e) => setEquipmentForm((prev) => ({ ...prev, category: e.target.value }))}
              className="rounded-xl border border-white/15 bg-slate-900/85 px-4 py-3 text-slate-100 outline-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="camera" className="bg-slate-900 text-slate-100">Camera</option>
              <option value="tripod" className="bg-slate-900 text-slate-100">Tripod</option>
              <option value="flash" className="bg-slate-900 text-slate-100">Flash</option>
            </select>
            <input
              value={equipmentForm.imageUrl}
              onChange={(e) => setEquipmentForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="Image URL (http... or /camera/file.png)"
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
              required
            />
            <button
              type="submit"
              disabled={equipmentActionLoading}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 md:col-span-3"
            >
              {equipmentActionLoading ? 'Saving...' : editingEquipmentId ? 'Update Equipment' : 'Add Equipment'}
            </button>
          </form>

          {equipmentError && <p className="mt-3 text-sm text-rose-300">{equipmentError}</p>}
          {equipmentMessage && <p className="mt-3 text-sm text-emerald-300">{equipmentMessage}</p>}
          {equipmentListError && <p className="mt-3 text-sm text-rose-300">{equipmentListError}</p>}

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {equipmentLoading ? (
              <p className="text-sm text-slate-300">Loading equipment...</p>
            ) : equipment.length === 0 ? (
              <p className="text-sm text-slate-300">No equipment found.</p>
            ) : (
              equipment.map((item) => (
                <article key={item._id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-300">{item.category}</p>
                    </div>
                    <button
                      type="button"
                      disabled={equipmentActionLoading}
                      onClick={() => handleEquipmentEdit(item)}
                      className="rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-100 disabled:opacity-60"
                    >
                      Edit
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white">Equipment Issue Requests</h3>
            <p className="mt-1 text-sm text-slate-300">Approve member requests and track full lifecycle: pending, approved, received, returned.</p>

            {equipmentIssuesError && <p className="mt-3 text-sm text-rose-300">{equipmentIssuesError}</p>}
            {equipmentIssuesMessage && <p className="mt-3 text-sm text-emerald-300">{equipmentIssuesMessage}</p>}

            <div className="mt-4 space-y-4">
              {equipmentIssuesLoading ? (
                <p className="text-sm text-slate-300">Loading issue requests...</p>
              ) : equipmentIssues.length === 0 ? (
                <p className="text-sm text-slate-300">No issue requests available.</p>
              ) : (
                equipmentIssues.map((issue) => (
                  <article key={issue._id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="text-base font-semibold text-white">{issue.equipmentName}</h4>
                        <p className="mt-1 text-xs text-slate-300">
                          Member: {issue?.member?.fullName?.firstName || 'Unknown'} {issue?.member?.fullName?.lastName || ''}
                        </p>
                      </div>
                      <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase ${issueStatusStyle(issue.status)}`}>
                        {issue.status}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-slate-200">{issue.purpose}</p>
                    <p className="mt-2 text-xs text-slate-300">
                      Use window: {formatDateTime(issue.useFrom)} - {formatDateTime(issue.useTo)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {issue.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            disabled={equipmentIssuesActionLoading}
                            onClick={() => updateIssueStatus(issue._id, 'approved')}
                            className="rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-100 disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={equipmentIssuesActionLoading}
                            onClick={() => updateIssueStatus(issue._id, 'rejected')}
                            className="rounded-lg border border-rose-300/40 bg-rose-500/20 px-3 py-1.5 text-xs font-semibold text-rose-100 disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {issue.status === 'approved' && (
                        <button
                          type="button"
                          disabled={equipmentIssuesActionLoading}
                          onClick={() => updateIssueStatus(issue._id, 'received')}
                          className="rounded-lg border border-sky-300/40 bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-100 disabled:opacity-60"
                        >
                          Mark Received
                        </button>
                      )}

                      {issue.status === 'received' && (
                        <button
                          type="button"
                          disabled={equipmentIssuesActionLoading}
                          onClick={() => updateIssueStatus(issue._id, 'returned')}
                          className="rounded-lg border border-violet-300/40 bg-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-100 disabled:opacity-60"
                        >
                          Mark Returned
                        </button>
                      )}
                    </div>

                    <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">History</p>
                      <div className="mt-2 space-y-1">
                        {Array.isArray(issue.history) && issue.history.length > 0 ? (
                          issue.history.map((entry, idx) => (
                            <p key={`${issue._id}-${idx}`} className="text-xs text-slate-300">
                              {formatDateTime(entry.changedAt)} - {entry.status}
                              {entry.note ? ` (${entry.note})` : ''}
                            </p>
                          ))
                        ) : (
                          <p className="text-xs text-slate-400">No history available.</p>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      )}
      </div>
    </PageWrapper>
  )
}

export default AdminDashboard
