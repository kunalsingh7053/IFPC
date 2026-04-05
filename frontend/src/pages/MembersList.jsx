import { useEffect, useState } from 'react'
import API from '../api/axios'
import MemberCard from '../components/MemberCard'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'

function MembersList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingMemberId, setUpdatingMemberId] = useState('')
  const [actionError, setActionError] = useState('')
  const role = localStorage.getItem('role')
  const isAdmin = role === 'admin'

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
      <h1 className="text-2xl font-bold text-white">Members List</h1>
      <p className="mt-2 text-slate-300">Admins can approve or reject members. Only approved members can log in.</p>

      {actionError && (
        <p className="mt-3 rounded-xl border border-rose-300/30 bg-rose-500/10 p-3 text-sm text-rose-200">{actionError}</p>
      )}

      {loading ? (
        <Loader label="Loading members" />
      ) : members.length === 0 ? (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">No members found yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
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
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateApproval(member._id, true)}
                        disabled={updatingMemberId === member._id}
                        className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Approve Again'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMember(member._id)}
                        disabled={updatingMemberId === member._id}
                        className="rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Delete'}
                      </button>
                    </div>
                  ) : member?.canLogin ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateApproval(member._id, false)}
                        disabled={updatingMemberId === member._id}
                        className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Revoke'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMember(member._id)}
                        disabled={updatingMemberId === member._id}
                        className="rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Delete'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateApproval(member._id, true)}
                        disabled={updatingMemberId === member._id}
                        className="rounded-lg border border-emerald-300/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Approve'}
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectApproval(member._id)}
                        disabled={updatingMemberId === member._id}
                        className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingMemberId === member._id ? 'Updating...' : 'Reject'}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMember(member._id)}
                        disabled={updatingMemberId === member._id}
                        className="rounded-lg border border-rose-300/35 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-200 hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
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
    </PageWrapper>
  )
}

export default MembersList
