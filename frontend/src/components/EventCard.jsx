import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function EventCard({ event }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg transition-all duration-500 hover:rounded-[56px]"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={event.thumbnail || 'https://placehold.co/600x300/0f172a/38bdf8?text=IFPC+Event'}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full border-2 border-white px-6 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white sm:text-base">
            Voir le projet
          </span>
        </div>
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold text-slate-100">{event.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-300">{event.description || 'No description available.'}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
          <span>{event.location || 'TBA'}</span>
        </div>
        <Link
          to={`/events/${event._id}`}
          className="inline-block rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-3 py-2 text-sm font-semibold text-white"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  )
}

export default EventCard
