import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import API from '../api/axios'
import PageWrapper from '../components/PageWrapper'
import SkeletonImage from '../components/SkeletonImage'
import dummyEvents from '../utils/dummyEvents'

const apiBase = (import.meta.env.VITE_API_URL || 'https://ifpc.onrender.com/api').replace(/\/api\/?$/, '')

function resolveImageSrc(src) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('/')) return `${apiBase}${src}`
  return `${apiBase}/${src}`
}

function isProjectGalleryImage(src) {
  return typeof src === 'string' && src.includes('/events/gallery/')
}

function Gallery() {
  const [events, setEvents] = useState(dummyEvents)
  const [previewImage, setPreviewImage] = useState('')

  useEffect(() => {
    async function loadEvents() {
      try {
        const { data } = await API.get('/events')
        const fetchedEvents = Array.isArray(data?.data) ? data.data : []
        if (fetchedEvents.length > 0) {
          setEvents(fetchedEvents)
        }
      } catch {
        // Keep already rendered fallback events for faster UX.
      }
    }

    loadEvents()
  }, [])

  const galleryImages = useMemo(() => {
    return events
      .flatMap((event) => {
        if (Array.isArray(event?.images) && event.images.length > 0) {
          return event.images
        }
        return event?.thumbnail ? [event.thumbnail] : []
      })
      .filter((image) => isProjectGalleryImage(image))
      .map((image) => resolveImageSrc(image))
      .filter(Boolean)
  }, [events])

  return (
    <PageWrapper>
      <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-emerald-300/20 bg-[linear-gradient(160deg,rgba(6,12,24,0.84),rgba(12,22,42,0.72))] p-6 backdrop-blur-xl sm:p-8">
          
          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Gallery
          </h1>
          <p className="mt-2 text-slate-300">All project photos from events. Click any image to preview.</p>

          {galleryImages.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-300">
              No project photos available yet.
            </div>
          ) : (
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {galleryImages.map((image, index) => (
                <motion.button
                  key={`${image}-${index}`}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setPreviewImage(image)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10"
                >
                  <SkeletonImage
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    fallbackSrc="/images/ifpc-icon.png"
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <p className="absolute bottom-2 left-3 text-xs font-semibold uppercase text-white">Frame {index + 1}</p>
                </motion.button>
              ))}
            </div>
          )}
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