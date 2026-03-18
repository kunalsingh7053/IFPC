import PageWrapper from '../components/PageWrapper'

function MemberDashboard() {
  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Member Dashboard</h1>
      <p className="mt-2 text-slate-300">Welcome to IFPC member space. Explore events and chat with the team.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold text-slate-100">Upcoming Events</h2>
          <p className="mt-2 text-sm text-slate-300">Check latest events and open details with gallery.</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="font-semibold text-slate-100">Community Chat</h2>
          <p className="mt-2 text-sm text-slate-300">Talk with members and admins in one shared channel.</p>
        </article>
      </div>
    </PageWrapper>
  )
}

export default MemberDashboard
