import { useEffect, useMemo, useState } from 'react'
import API from '../api/axios'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'
import SkeletonImage from '../components/SkeletonImage'

const apiBase = (import.meta.env.VITE_API_URL || 'https://ifpc.onrender.com/api').replace(/\/api\/?$/, '')

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
  president: 'border-emerald-300/60 bg-emerald-500/20 text-emerald-200',
  'vice-president': 'border-emerald-300/50 bg-emerald-500/15 text-emerald-200',
  core: 'border-violet-300/45 bg-violet-500/15 text-violet-200',
  secretary: 'border-emerald-300/45 bg-emerald-500/15 text-emerald-200',
  treasurer: 'border-sky-300/45 bg-sky-500/15 text-sky-200',
  head: 'border-rose-300/45 bg-rose-500/15 text-rose-200',
  admin: 'border-green-300/45 bg-green-500/15 text-green-200',
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

const resolveProfileImage = (src) => {
  if (!src) return ''
  const value = String(src).trim()

  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return encodeURI(value)
  if (value.startsWith('//')) return encodeURI(`https:${value}`)
  if (value.startsWith('/')) return encodeURI(`${apiBase}${value}`)

  return encodeURI(`${apiBase}/${value}`)
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
    const resolvedProfileImage = resolveProfileImage(member?.profileImage)
    const fallbackAvatar = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(name || 'IFPC Member')}&backgroundColor=0f172a,134e4a,14532d`
    const isTopLeader = normalizedRole === 'president' || normalizedRole === 'vice-president'
    const photoSizeClass = isTopLeader ? 'h-64' : 'h-56'

    return (
      <article
        key={member._id || `${name}-${index}`}
        className="team-card-enter group p-2 transition"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        <div className="mb-4 flex justify-center">
          <SkeletonImage
            src={resolvedProfileImage || fallbackAvatar}
            fallbackSrc={fallbackAvatar}
            alt={name}
            className={`team-avatar-zoom ${photoSizeClass} w-full object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)]`}
            wrapperClassName={`${photoSizeClass} w-full overflow-visible bg-transparent`}
          />
        </div>

        <h2 className="text-center text-lg font-semibold text-white">{name}</h2>
        <p
          className={`team-badge-glow mx-auto mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${roleBadgeClass[normalizedRole] || roleBadgeClass.member}`}
        >
          {getRoleLabel(member?.position || 'member')}
        </p>
        <div className="mt-2 text-center">
          <p className="text-sm text-slate-300">{member?.department || 'General Team'}</p>
        </div>
      </article>
    )
  }

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">Our Team</h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Meet the IFPC leadership and core contributors with verified profile photos and role details.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter.key
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-500 text-white'
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
