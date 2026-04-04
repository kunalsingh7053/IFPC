import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import API from '../api/axios'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'
import SkeletonImage from '../components/SkeletonImage'
import dummyEvents from '../utils/dummyEvents'

function EventDetails() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    async function fetchEvent() {
      try {
        const { data } = await API.get(`/events/${id}`)
        const fetchedEvent = data?.data || dummyEvents.find((item) => item._id === id)
        setEvent(fetchedEvent || null)
        if (!fetchedEvent) {
          setError('Unable to fetch event details')
        }
      } catch (err) {
        const fallbackEvent = dummyEvents.find((item) => item._id === id)
        if (fallbackEvent) {
          setEvent(fallbackEvent)
          setError('')
        } else {
          setError(err?.response?.data?.message || 'Unable to fetch event details')
        }
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
        <SkeletonImage
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
              <button
                key={img}
                type="button"
                onClick={() => setPreviewImage(img)}
                className="group relative w-full cursor-zoom-in overflow-hidden rounded-xl text-left"
              >
                <SkeletonImage src={img} alt="event" className="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="rounded-full border border-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                    View
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {previewImage ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[12000] grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
              onClick={() => setPreviewImage('')}
            >
              <motion.img
                src={previewImage}
                alt="Project preview"
                initial={{ scale: 0.92, opacity: 0, filter: 'blur(8px)' }}
                animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                exit={{ scale: 0.97, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="max-h-[86vh] w-full max-w-5xl rounded-2xl border border-emerald-300/35 object-cover shadow-[0_18px_50px_rgba(0,0,0,0.56)]"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </PageWrapper>
  )
}

export default EventDetails
