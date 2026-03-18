import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'

function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await API.get(`/events/${id}`)
        setEvent(data?.data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to fetch event details')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  if (loading) return <Loader label="Loading details" />
  if (error) return <p className="text-rose-300">{error}</p>
  if (!event) return null

  return (
    <PageWrapper>
      <div className="space-y-5">
        <img
          src={event.thumbnail || 'https://placehold.co/1200x400/0f172a/38bdf8?text=IFPC'}
          alt={event.title}
          className="h-64 w-full rounded-2xl object-cover"
        />
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h1 className="text-3xl font-bold text-white">{event.title}</h1>
          <p className="mt-2 text-slate-300">{event.description}</p>
          <p className="mt-3 text-sm text-slate-400">
            {new Date(event.eventDate).toLocaleString()} • {event.location || 'TBA'}
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-slate-100">Gallery</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(event.images || []).map((img) => (
              <img key={img} src={img} alt="event" className="h-52 w-full rounded-xl object-cover" />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default EventDetails
