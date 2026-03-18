import { useEffect, useMemo, useState } from 'react'
import API from '../api/axios'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'

const filters = [
  { key: 'all', label: 'All Team' },
  { key: 'president', label: 'President' },
  { key: 'vice-president', label: 'Vice President' },
]

const normalizePosition = (value = '') => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'presedent' ? 'president' : normalized
}

const rolePriority = {
  president: 0,
  'vice-president': 1,
  head: 2,
  core: 3,
  secretary: 3,
  treasurer: 3,
  admin: 3,
  member: 6,
}

const roleBadgeClass = {
  president: 'border-amber-300/60 bg-amber-500/20 text-amber-200',
  'vice-president': 'border-cyan-300/50 bg-cyan-500/15 text-cyan-200',
  core: 'border-violet-300/45 bg-violet-500/15 text-violet-200',
  secretary: 'border-emerald-300/45 bg-emerald-500/15 text-emerald-200',
  treasurer: 'border-sky-300/45 bg-sky-500/15 text-sky-200',
  head: 'border-rose-300/45 bg-rose-500/15 text-rose-200',
  admin: 'border-fuchsia-300/45 bg-fuchsia-500/15 text-fuchsia-200',
  member: 'border-white/20 bg-white/10 text-slate-200',
}

const getRoleLabel = (value = '') => {
  const role = normalizePosition(value)

  if (role === 'president') return 'Hon. President'
  if (role === 'vice-president') return 'Vice President'
  if (role === 'core') return 'Core Member'
  if (role === 'admin') return 'Administrator'
  if (!role) return 'Member'

  return role
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function TeamPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data } = await API.get('/users/public-members')
        setMembers(Array.isArray(data?.data) ? data.data : [])
      } catch {
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  const visibleMembers = useMemo(() => {
    const filteredMembers = activeFilter === 'all' ? members : members.filter((member) => {
      const normalizedPosition = normalizePosition(member?.position || '')
      return normalizedPosition === activeFilter
    })

    return [...filteredMembers].sort((a, b) => {
      const positionA = normalizePosition(a?.position || 'member')
      const positionB = normalizePosition(b?.position || 'member')
      const priorityA = rolePriority[positionA] ?? 99
      const priorityB = rolePriority[positionB] ?? 99

      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }

      const nameA = `${a?.fullName?.firstName || ''} ${a?.fullName?.lastName || ''}`.trim().toLowerCase()
      const nameB = `${b?.fullName?.firstName || ''} ${b?.fullName?.lastName || ''}`.trim().toLowerCase()
      return nameA.localeCompare(nameB)
    })
  }, [members, activeFilter])

  const topLeaders = useMemo(
    () =>
      visibleMembers.filter((member) => {
        const role = normalizePosition(member?.position || 'member')
        return role === 'president' || role === 'vice-president'
      }),
    [visibleMembers]
  )

  const otherMembers = useMemo(
    () =>
      visibleMembers.filter((member) => {
        const role = normalizePosition(member?.position || 'member')
        return role !== 'president' && role !== 'vice-president'
      }),
    [visibleMembers]
  )

  const renderMemberCard = (member, index = 0) => {
    const name = member?.fullName
      ? `${member.fullName.firstName || ''} ${member.fullName.lastName || ''}`.trim()
      : 'Unnamed Member'
    const normalizedRole = normalizePosition(member?.position || 'member')

    return (
      <article
        key={member._id || `${name}-${index}`}
        className="team-card-enter group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-sm hover:border-white/25 hover:shadow-[0_16px_45px_rgba(5,10,20,0.5)]"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <div className="mb-3 overflow-hidden rounded-xl border border-white/10 bg-slate-900/50">
          {member?.profileImage ? (
            <img
              src={member.profileImage}
              alt={name}
              className="team-avatar-zoom h-56 w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-5xl font-bold text-slate-300">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>

        <h2 className="text-lg font-semibold text-white">{name}</h2>
        <p
          className={`team-badge-glow mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${roleBadgeClass[normalizedRole] || roleBadgeClass.member}`}
        >
          {getRoleLabel(member?.position || 'member')}
        </p>
        <p className="mt-1 text-sm text-slate-300">{member?.department || 'General Team'}</p>
      </article>
    )
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Our Team</h1>
      <p className="mt-2 text-slate-300">View all team members, including president and vice president.</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter.key
                ? 'bg-gradient-to-r from-amber-500 to-emerald-500 text-white'
                : 'border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Loading team members" />
      ) : visibleMembers.length === 0 ? (
        <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
          No members found for this filter.
        </p>
      ) : (
        <>
          {topLeaders.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {topLeaders.map((member, index) => renderMemberCard(member, index))}
            </div>
          )}

          {otherMembers.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {otherMembers.map((member, index) => renderMemberCard(member, index + topLeaders.length))}
            </div>
          )}
        </>
      )}
    </PageWrapper>
  )
}

export default TeamPage
