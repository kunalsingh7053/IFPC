import { motion } from 'framer-motion'

function MemberCard({ member }) {
  const name = member?.fullName
    ? `${member.fullName.firstName || ''} ${member.fullName.lastName || ''}`.trim()
    : member?.username || 'Unnamed Member'

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/25 text-sm font-semibold text-cyan-200">
          {name.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">{name}</h3>
          <p className="text-xs text-slate-400">{member?.email || 'No email'}</p>
        </div>
      </div>
      <p className="text-sm text-slate-300">Position: {member?.position || 'member'}</p>
    </motion.article>
  )
}

export default MemberCard
