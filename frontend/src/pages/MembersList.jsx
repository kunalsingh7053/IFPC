import { useEffect, useMemo, useState } from 'react'
import API from '../api/axios'
import MemberCard from '../components/MemberCard'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'

function getMemberStatus(member) {
  if (member?.isActive === false) return 'rejected'
  if (member?.canLogin) return 'approved'
  return 'pending'
}

function getMemberSearchText(member) {
  const firstName = member?.fullName?.firstName || ''
  const lastName = member?.fullName?.lastName || ''
  const name = `${firstName} ${lastName}`.trim()
  return [
    name,
    member?.email || '',
    member?.department || '',
    member?.position || '',
  ]
    .join(' ')
    .toLowerCase()
}

function MembersList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingMemberId, setUpdatingMemberId] = useState('')
  const [actionError, setActionError] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchText, setSearchText] = useState('')
  const role = localStorage.getItem('role')
  const isAdmin = role === 'admin'

  const memberSummary = useMemo(() => {
    const summary = { all: members.length, pending: 0, approved: 0, rejected: 0 }
    members.forEach((member) => {
      const status = getMemberStatus(member)
      summary[status] += 1
    })
    return summary
  }, [members])

  const filteredMembers = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    return members
      .filter((member) => {
        const status = getMemberStatus(member)
        const matchesStatus = statusFilter === 'all' || status === statusFilter
        const matchesQuery = !query || getMemberSearchText(member).includes(query)
        return matchesStatus && matchesQuery
      })
      .sort((a, b) => {
        const priority = { pending: 0, approved: 1, rejected: 2 }
        const aStatus = getMemberStatus(a)
        const bStatus = getMemberStatus(b)
        return (priority[aStatus] ?? 99) - (priority[bStatus] ?? 99)
      })
  }, [members, searchText, statusFilter])

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data } = await API.get('/users/members')
        setMembers(data?.data || data?.members || [])
      } catch {
        // Fallback placeholder if backend list API is unavailable
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  async function updateApproval(memberId, approved) {
    try {
      setUpdatingMemberId(memberId)
      setActionError('')

      await API.patch(`/users/${memberId}/approval`, { approved })

      setMembers((prev) =>
        prev.map((member) =>
          member._id === memberId
            ? {
                ...member,
                canLogin: approved,
                isActive: approved ? true : member.isActive,
              }
            : member
        )
      )
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setActionError(apiMessage || 'Failed to update member approval')
    } finally {
      setUpdatingMemberId('')
    }
  }

  async function rejectApproval(memberId) {
    try {
      setUpdatingMemberId(memberId)
      setActionError('')

      await API.patch(`/users/${memberId}/reject`)

      setMembers((prev) =>
        prev.map((member) =>
          member._id === memberId
            ? {
                ...member,
                canLogin: false,
                isActive: false,
              }
            : member
        )
      )
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setActionError(apiMessage || 'Failed to reject member approval')
    } finally {
      setUpdatingMemberId('')
    }
  }

  async function deleteMember(memberId) {
    const confirmed = window.confirm('Delete this member permanently? This will also delete chat history and profile image if available.')
    if (!confirmed) return

    try {
      setUpdatingMemberId(memberId)
      setActionError('')

      await API.delete(`/users/${memberId}`)

      setMembers((prev) => prev.filter((member) => member._id !== memberId))
    } catch (err) {
      const apiMessage = err?.response?.data?.message
      setActionError(apiMessage || 'Failed to delete member')
    } finally {
      setUpdatingMemberId('')
    }
  }

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-6">
      <h1 className="text-2xl font-bold text-white">Member Approval Queue</h1>
      <p className="mt-2 text-slate-300">Review pending registrations, approve faster, and keep access control organized.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Total Members</p>
          <p className="mt-2 text-2xl font-bold text-white">{memberSummary.all}</p>
        </article>
        <article className="rounded-2xl border border-amber-300/30 bg-amber-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-amber-100">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-100">{memberSummary.pending}</p>
        </article>
        <article className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-100">Approved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-100">{memberSummary.approved}</p>
        </article>
        <article className="rounded-2xl border border-rose-300/30 bg-rose-500/10 p-4">
          <p className="text-xs uppercase tracking-[0.14em] text-rose-100">Rejected</p>
          <p className="mt-2 text-2xl font-bold text-rose-100">{memberSummary.rejected}</p>
        </article>
      </div>

      <section className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: 'all', label: `All (${memberSummary.all})` },
            { key: 'pending', label: `Pending (${memberSummary.pending})` },
            { key: 'approved', label: `Approved (${memberSummary.approved})` },
            { key: 'rejected', label: `Rejected (${memberSummary.rejected})` },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setStatusFilter(item.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                statusFilter === item.key
                  ? 'bg-emerald-500 text-white shadow-[0_8px_20px_rgba(16,185,129,0.35)]'
                  : 'border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name, email, department, or position"
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-400"
          />
        </div>

        <p className="mt-3 text-xs text-slate-300">
          Showing {filteredMembers.length} of {members.length} members
        </p>
      </section>

      {actionError && (
        <p className="mt-3 rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-200">{actionError}</p>
      )}

      {loading ? (
        <Loader label="Loading members" />
      ) : filteredMembers.length === 0 ? (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">No members found yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member) => (
            <div key={member._id || member.email} className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-2">
              <MemberCard member={member} />

              <div className="flex items-center justify-between gap-2 px-2 pb-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    member?.isActive === false
                      ? 'border border-rose-300/40 bg-rose-500/15 text-rose-200'
                      : member?.canLogin
                      ? 'border border-emerald-300/40 bg-emerald-500/15 text-emerald-200'
                      : 'border border-amber-300/40 bg-amber-500/15 text-amber-200'
                  }`}
                >
                  {member?.isActive === false ? 'Rejected' : member?.canLogin ? 'Approved' : 'Pending Approval'}
                </span>

                {isAdmin && member?._id && (
                  member?.isActive === false ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateApproval(member._id, true)}
                        disabled={updatingMemberId === member._id}
                        className="w-full rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Approve Again'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMember(member._id)}
                        disabled={updatingMemberId === member._id}
                        className="w-full rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Delete'}
                      </button>
                    </div>
                  ) : member?.canLogin ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateApproval(member._id, false)}
                        disabled={updatingMemberId === member._id}
                        className="w-full rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Revoke'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMember(member._id)}
                        disabled={updatingMemberId === member._id}
                        className="w-full rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Delete'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateApproval(member._id, true)}
                        disabled={updatingMemberId === member._id}
                        className="w-full rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Approve'}
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectApproval(member._id)}
                        disabled={updatingMemberId === member._id}
                        className="w-full rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Reject'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMember(member._id)}
                        disabled={updatingMemberId === member._id}
                        className="w-full rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Delete'}
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </PageWrapper>
  )
}

export default MembersList
