import { useEffect, useMemo, useState } from 'react'
import PageWrapper from '../components/PageWrapper'
import API from '../api/axios'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadStats = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await API.get('/auth/dashboard-stats')
        if (mounted) {
          setStats(response.data?.data || null)
        }
      } catch (err) {
        if (mounted) {
          setError(err.response?.data?.message || 'Failed to load dashboard stats')
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadStats()
    return () => {
      mounted = false
    }
  }, [])

  const positionCards = useMemo(() => {
    if (!stats?.positionCounts) return []

    return Object.entries(stats.positionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([position, count]) => ({
        title: position.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
        value: count,
      }))
  }, [stats])

  const topCards = [
    { title: 'Total Members', value: stats?.totalMembers ?? 0 },
    { title: 'Core Members', value: stats?.coreMembers ?? 0 },
    { title: 'Head Members', value: stats?.headMembers ?? 0 },
    { title: 'Total Events', value: stats?.totalEvents ?? 0 },
    { title: 'Events Covered', value: stats?.eventsCovered ?? 0 },
    { title: 'Upcoming Events', value: stats?.upcomingEvents ?? 0 },
  ]

  const adminPowers = [
    'Manage member records and approvals',
    'Create and update events with gallery images',
    'Delete events and moderate chat content',
    'Monitor active/approved member counts',
  ]

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

      {loading && (
        <p className="mt-4 text-sm text-slate-300">Loading dashboard data...</p>
      )}

      {error && (
        <p className="mt-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {topCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-sm font-medium uppercase tracking-wide text-slate-300">{card.title}</h3>
                <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Members by Position</h2>
              {positionCards.length === 0 ? (
                <p className="mt-3 text-sm text-slate-300">No member distribution data found.</p>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {positionCards.map((item) => (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-slate-900/30 px-4 py-3">
                      <p className="text-sm text-slate-300">{item.title}</p>
                      <p className="text-2xl font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold text-white">Admin Powers</h2>
              <ul className="mt-4 space-y-3">
                {adminPowers.map((power) => (
                  <li key={power} className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    {power}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </>
      )}
    </PageWrapper>
  )
}

export default AdminDashboard
