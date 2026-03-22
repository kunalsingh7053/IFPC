import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import API from '../api/axios'
import PageWrapper from '../components/PageWrapper'

const fallbackImages = [
  '/images/ifpc-icon.png',
  '/images/ifpc-icon.png',
  '/images/ifpc-icon.png',
  '/images/ifpc-icon.png',
  '/images/ifpc-icon.png',
  '/images/ifpc-icon.png',
]

function Gallery() {
  const [events, setEvents] = useState([])
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    async function loadEvents() {
      try {
        const { data } = await API.get('/events')
        setEvents(Array.isArray(data?.data) ? data.data : [])
      } catch {
        setEvents([])
      }
    }

    loadEvents()
  }, [])

  const galleryImages = useMemo(() => {
    const fromEvents = events
      .map((event) => event?.thumbnail)
      .filter(Boolean)
      .slice(0, 12)

    if (fromEvents.length >= 8) return fromEvents

    return [...fromEvents, ...fallbackImages].slice(0, 12)
  }, [events])

  return (
    <PageWrapper>
      <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-cyan-300/20 bg-[linear-gradient(160deg,rgba(6,12,24,0.84),rgba(12,22,42,0.72))] p-6 backdrop-blur-xl sm:p-8">
          <h1 className="text-3xl font-black text-white sm:text-4xl">Gallery</h1>
          <p className="mt-2 text-slate-300">Responsive IFPC showcase with hover zoom and click preview.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {galleryImages.map((image, index) => (
              <motion.button
                key={`${image}-${index}`}
                type="button"
                whileHover={{ scale: 1.02 }}
                onClick={() => setPreviewImage(image)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 text-left"
              >
                <img src={image} alt={`Gallery ${index + 1}`} className="h-52 w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
                <p className="absolute bottom-2 left-3 text-xs font-semibold uppercase tracking-[0.13em] text-white/90">Frame {index + 1}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

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
              alt="Preview"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="max-h-[86vh] w-full max-w-5xl rounded-2xl border border-cyan-300/30 object-cover shadow-[0_18px_55px_rgba(0,0,0,0.55)]"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PageWrapper>
  )
}

export default Gallery
