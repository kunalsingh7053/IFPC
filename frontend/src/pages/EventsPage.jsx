import { useEffect, useState } from 'react'
import API from '../api/axios'
import EventCard from '../components/EventCard'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'

function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data } = await API.get('/events')
        setEvents(data?.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Events</h1>
      <p className="mt-2 text-slate-300">Public event list with thumbnail and details.</p>

      {loading ? (
        <Loader label="Loading events" />
      ) : error ? (
        <p className="mt-4 text-rose-300">{error}</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

export default EventsPage
