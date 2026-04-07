import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import API from '../api/axios'
import PageWrapper from '../components/PageWrapper'

const categoryMeta = {
  camera: {
    title: 'Camera',
    icon: 'CAM',
    accent: 'from-cyan-400/30 to-blue-500/20',
  },
  tripod: {
    title: 'Tripod',
    icon: 'TRI',
    accent: 'from-emerald-400/30 to-lime-400/20',
  },
  flash: {
    title: 'Flash',
    icon: 'FLA',
    accent: 'from-amber-300/35 to-orange-500/25',
  },
}

const apiBase = (import.meta.env.VITE_API_URL || 'https://ifpc-1.onrender.com/api').replace(/\/api\/?$/, '')

function resolveImage(imageUrl) {
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http')) return imageUrl
  if (imageUrl.startsWith('/camera/') || imageUrl.startsWith('/images/')) return imageUrl
  if (imageUrl.startsWith('/')) return `${apiBase}${imageUrl}`
  return `${apiBase}/${imageUrl}`
}

function Equipment() {
  const [equipment, setEquipment] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchEquipment() {
    try {
      setLoading(true)
      setError('')
      const { data } = await API.get('/equipment')
      const rows = Array.isArray(data?.data) ? data.data : []
      setEquipment(rows)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load equipment right now')
      setEquipment([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipment()
  }, [])

  const grouped = useMemo(() => {
    return ['camera', 'tripod', 'flash'].map((category) => ({
      category,
      items: equipment.filter((item) => item.category === category),
    }))
  }, [equipment])

  return (
    <PageWrapper>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 px-6 py-10 md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.25),transparent_33%),radial-gradient(circle_at_82%_22%,rgba(16,185,129,0.20),transparent_34%),radial-gradient(circle_at_46%_100%,rgba(251,191,36,0.18),transparent_38%)]" />

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative z-10"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300">IFPC Gear Deck</p>
          <h1 className="mt-3 text-3xl font-extrabold text-white md:text-5xl">Equipment</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-200/90 md:text-base">
            Aesthetic showcase of cameras, support, and flash systems used by the team.
          </p>
        </motion.div>
      </section>

      {error && <p className="mt-5 text-sm text-rose-300">{error}</p>}

      {loading ? (
        <p className="mt-8 text-sm text-slate-300">Loading equipment...</p>
      ) : (
        <div className="mt-8 space-y-8">
          {grouped.map((group, groupIndex) => {
            const meta = categoryMeta[group.category]
            return (
              <section key={group.category}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-slate-200">
                    {meta.icon}
                  </span>
                  <h2 className="text-2xl font-semibold text-white">{meta.title}</h2>
                </div>

                {group.items.length === 0 ? (
                  <p className="text-sm text-slate-300">No {meta.title.toLowerCase()} items added yet.</p>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {group.items.map((item, idx) => (
                      <motion.article
                        key={item._id}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.08 + idx * 0.06, duration: 0.42 }}
                        whileHover={{ y: -6, rotate: -0.4 }}
                        className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60"
                      >
                        <div className="relative flex h-52 items-center justify-center overflow-hidden bg-transparent p-3">
                          <img
                            src={resolveImage(item.imageUrl)}
                            alt={item.name}
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">{meta.title}</p>

                        </div>
                      </motion.article>
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}

export default Equipment
