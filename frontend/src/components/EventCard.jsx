import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function EventCard({ event }) {
  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.01 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-lg"
    >
      <img
        src={event.thumbnail || 'https://placehold.co/600x300/0f172a/38bdf8?text=IFPC+Event'}
        alt={event.title}
        className="h-44 w-full object-cover"
      />
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold text-slate-100">{event.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-300">{event.description || 'No description available.'}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{new Date(event.eventDate).toLocaleDateString()}</span>
          <span>{event.location || 'TBA'}</span>
        </div>
        <Link
          to={`/events/${event._id}`}
          className="inline-block rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-3 py-2 text-sm font-semibold text-white"
        >
          View Details
        </Link>
      </div>
    </motion.article>
  )
}

export default EventCard
