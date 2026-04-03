import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import API from '../api/axios'
import PageWrapper from '../components/PageWrapper'

const fallbackImages = [
  'https://images.unsplash.com/photo-1620693778087-2bced33a4a06?q=80&w=1332',
  'https://images.unsplash.com/photo-1665844092826-515257903c4c?q=80&w=687',
  'https://images.unsplash.com/photo-1598607993929-b48389d1de94?q=80&w=1170',
  'https://plus.unsplash.com/premium_photo-1665772800736-e655b2fec2e7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1597942080393-4cecdfbcee17?q=80&w=735',
  'https://images.unsplash.com/photo-1528788923685-864db0cbc312?q=80&w=730',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1170',
]

// 🔥 CHANGE THIS TO YOUR BACKEND URL
const BASE_URL = 'http://localhost:5000'

function Gallery() {
  const [events, setEvents] = useState([])
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await API.get('/events')

        console.log('API DATA:', res.data)

        const eventData = Array.isArray(res?.data?.data)
          ? res.data.data
          : []

        setEvents(eventData)
      } catch (error) {
        console.error('API ERROR:', error)
        setEvents([])
      }
    }

    loadEvents()
  }, [])

  const galleryImages = useMemo(() => {
    const fromEvents = events
      .map((event) => {
        if (!event?.thumbnail) return null

        // if already full URL → use directly
        if (event.thumbnail.startsWith('http')) {
          return event.thumbnail
        }

        // otherwise add base URL
        return BASE_URL + event.thumbnail
      })
      .filter(Boolean)
      .slice(0, 12)

    return [...fallbackImages, ...fromEvents].slice(0, 12)
  }, [events])

  return (
    <PageWrapper>
      <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-emerald-300/20 bg-[linear-gradient(160deg,rgba(6,12,24,0.84),rgba(12,22,42,0.72))] p-6 backdrop-blur-xl sm:p-8">
          
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Gallery
          </h1>
          <p className="mt-2 text-slate-300">
            Click any image to preview
          </p>

          {/* GRID */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryImages.map((image, index) => (
              <motion.button
                key={index}
                type="button"
                whileHover={{ scale: 1.05 }}
                onClick={() => setPreviewImage(image)}
                className="group relative overflow-hidden rounded-2xl border border-white/10"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <p className="absolute bottom-2 left-3 text-xs font-semibold uppercase text-white">
                  Frame {index + 1}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setPreviewImage('')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={previewImage}
              alt="Preview"
              onError={(e) => {
                e.currentTarget.src =
                  'https://via.placeholder.com/800x600?text=Image+Error'
              }}
              className="max-h-[85vh] w-[calc(100%-2rem)] max-w-md rounded-xl object-cover md:max-h-[90vh] md:w-full md:max-w-5xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}

export default Gallery