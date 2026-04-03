import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import API from '../api/axios'
import PageWrapper from '../components/PageWrapper'

const normalizePosition = (value = '') => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'presedent' ? 'president' : normalized
}

const rolePriority = {
  president: 0,
  'vice-president': 1,
  head: 2,
  core: 3,
  secretary: 4,
  member: 6,
}

function Faculty() {
  const [members, setMembers] = useState([])

  useEffect(() => {
    async function loadMembers() {
      try {
        const { data } = await API.get('/users/public-members')
        setMembers(Array.isArray(data?.data) ? data.data : [])
      } catch {
        setMembers([])
      }
    }

    loadMembers()
  }, [])

  const facultyMembers = useMemo(() => {
    return [...members]
      .sort((a, b) => {
        const roleA = normalizePosition(a?.position || 'member')
        const roleB = normalizePosition(b?.position || 'member')
        const priorityA = rolePriority[roleA] ?? 99
        const priorityB = rolePriority[roleB] ?? 99
        if (priorityA !== priorityB) return priorityA - priorityB

        const nameA = `${a?.fullName?.firstName || ''} ${a?.fullName?.lastName || ''}`.trim().toLowerCase()
        const nameB = `${b?.fullName?.firstName || ''} ${b?.fullName?.lastName || ''}`.trim().toLowerCase()
        return nameA.localeCompare(nameB)
      })
      .slice(0, 8)
  }, [members])

  return (
    <PageWrapper>
      <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-emerald-300/20 bg-[linear-gradient(165deg,rgba(6,12,24,0.85),rgba(11,20,39,0.74))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.38)] backdrop-blur-xl sm:p-8">
          <h1 className="text-3xl font-black text-white sm:text-4xl">Faculty</h1>
          <p className="mt-2 text-slate-300">Meet IFPC leadership and core creative mentors.</p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {facultyMembers.map((member, index) => {
              const name = `${member?.fullName?.firstName || ''} ${member?.fullName?.lastName || ''}`.trim() || 'IFPC Member'
              const role = normalizePosition(member?.position || 'member')
              const roleLabel = role
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')

              return (
                <motion.article
                  key={member?._id || `${name}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl border border-green-300/25 bg-[linear-gradient(165deg,rgba(10,15,30,0.78),rgba(13,20,39,0.65))] p-4"
                >
                  {member?.profileImage ? (
                    <img src={member.profileImage} alt={name} className="h-40 w-full rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center rounded-xl bg-slate-900 text-4xl font-black text-slate-300">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="mt-3 text-lg font-bold text-white">{name}</h2>
                  <p className="mt-1 text-sm text-emerald-200">{roleLabel || 'Member'}</p>
                  <p className="mt-1 text-xs text-slate-300">{member?.department || 'IFPC Community'}</p>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

export default Faculty
