import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PageWrapper from '../components/PageWrapper'
import API from '../api/axios'

const initialRequestForm = {
  equipmentId: '',
  customEquipmentName: '',
  purpose: '',
  useFrom: '',
  useTo: '',
}

function toDateTimeLocal(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString()
}

function statusBadgeClass(status) {
  const map = {
    pending: 'border-amber-300/40 bg-amber-500/20 text-amber-100',
    approved: 'border-emerald-300/40 bg-emerald-500/20 text-emerald-100',
    rejected: 'border-rose-300/40 bg-rose-500/20 text-rose-100',
    received: 'border-sky-300/40 bg-sky-500/20 text-sky-100',
    returned: 'border-violet-300/40 bg-violet-500/20 text-violet-100',
  }
  return map[status] || 'border-white/20 bg-white/10 text-slate-100'
}

function MemberDashboard() {
  const [equipment, setEquipment] = useState([])
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(initialRequestForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const selectedEquipment = useMemo(
    () => equipment.find((item) => item._id === form.equipmentId) || null,
    [equipment, form.equipmentId]
  )

  const issueSummary = useMemo(() => {
    return issues.reduce(
      (acc, issue) => {
        const status = issue?.status || 'pending'
        acc.total += 1
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      { total: 0, pending: 0, approved: 0, rejected: 0, received: 0, returned: 0 }
    )
  }, [issues])

  async function loadData() {
    try {
      setLoading(true)
      setError('')

      const [equipmentRes, issuesRes] = await Promise.all([
        API.get('/equipment'),
        API.get('/equipment-issues/member'),
      ])

      setEquipment(Array.isArray(equipmentRes?.data?.data) ? equipmentRes.data.data : [])
      setIssues(Array.isArray(issuesRes?.data?.data) ? issuesRes.data.data : [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load member dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function resetForm() {
    setForm(initialRequestForm)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!form.purpose || !form.useFrom || !form.useTo) {
      setError('Purpose, use from and use to are required')
      return
    }

    if (!form.equipmentId && !form.customEquipmentName.trim()) {
      setError('Select equipment or add custom equipment name')
      return
    }

    try {
      setSubmitting(true)
      await API.post('/equipment-issues/member', {
        equipmentId: form.equipmentId || null,
        customEquipmentName: form.customEquipmentName,
        purpose: form.purpose,
        useFrom: form.useFrom,
        useTo: form.useTo,
      })
      setMessage('Equipment issue request submitted')
      resetForm()
      await loadData()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to submit request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-7xl">
      <h1 className="text-2xl font-bold text-white">Member Dashboard</h1>
      <p className="mt-2 text-slate-300">Request equipment usage, track approval, and view full issue history.</p>

      <section className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Request Insights</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <article className="rounded-xl border border-amber-300/35 bg-amber-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.13em] text-amber-100">Pending</p>
              <p className="mt-1 text-2xl font-bold text-amber-100">{issueSummary.pending}</p>
            </article>
            <article className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.13em] text-emerald-100">Approved</p>
              <p className="mt-1 text-2xl font-bold text-emerald-100">{issueSummary.approved}</p>
            </article>
            <article className="rounded-xl border border-rose-300/35 bg-rose-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.13em] text-rose-100">Rejected</p>
              <p className="mt-1 text-2xl font-bold text-rose-100">{issueSummary.rejected}</p>
            </article>
          </div>
          <p className="mt-3 text-xs text-slate-300">Total requests tracked: {issueSummary.total}</p>
        </div>

        <div className="rounded-2xl border border-sky-300/30 bg-sky-500/10 p-4 sm:p-5">
          <h2 className="text-base font-semibold text-sky-100">Quick Actions</h2>
          <p className="mt-1 text-sm text-sky-100/90">Open collaboration tools and manage your activity from one place.</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              to="/member-dashboard/chat"
              className="rounded-xl border border-sky-300/40 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-100"
            >
              Open Chat
            </Link>
            <Link
              to="/profile"
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100"
            >
              Open Profile
            </Link>
          </div>
        </div>
      </section>

      {error && <p className="mt-4 rounded-xl border border-rose-300/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</p>}
      {message && <p className="mt-4 rounded-xl border border-emerald-300/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{message}</p>}

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">Create Equipment Requirement</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-200">Select Equipment</span>
            <select
              name="equipmentId"
              value={form.equipmentId}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 bg-slate-900/85 px-4 py-3 text-slate-100 outline-none"
              style={{ colorScheme: 'dark' }}
            >
              <option value="">-- Choose equipment (optional) --</option>
              {equipment.map((item) => (
                <option key={item._id} value={item._id}>{item.name} ({item.category})</option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Custom Equipment Name (if not listed)</span>
            <input
              name="customEquipmentName"
              value={form.customEquipmentName}
              onChange={handleChange}
              placeholder="e.g. GoPro Hero 12"
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm text-slate-200">Purpose / Usage Details</span>
            <textarea
              name="purpose"
              value={form.purpose}
              onChange={handleChange}
              placeholder="What will you use this for?"
              className="min-h-24 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Use From</span>
            <input
              type="datetime-local"
              name="useFrom"
              value={form.useFrom}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
              required
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-200">Use To</span>
            <input
              type="datetime-local"
              name="useTo"
              value={form.useTo}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
              required
            />
          </label>

          {selectedEquipment && (
            <p className="text-xs text-slate-300 md:col-span-2">Selected: {selectedEquipment.name} ({selectedEquipment.category})</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 font-semibold text-white disabled:opacity-60 md:col-span-2"
          >
            {submitting ? 'Submitting...' : 'Submit Requirement'}
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold text-white">My Equipment Issues History</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-300">Loading requests...</p>
        ) : issues.length === 0 ? (
          <p className="mt-3 text-sm text-slate-300">No requests yet.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {issues.map((issue) => (
              <article key={issue._id} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-white">{issue.equipmentName}</h3>
                  <span className={`rounded-lg border px-2.5 py-1 text-xs font-semibold uppercase ${statusBadgeClass(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-200">{issue.purpose}</p>
                <p className="mt-2 text-xs text-slate-300">Use window: {toDateTimeLocal(issue.useFrom)} - {toDateTimeLocal(issue.useTo)}</p>
                <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/45 p-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">History</p>
                  <div className="mt-2 space-y-1">
                    {Array.isArray(issue.history) && issue.history.length > 0 ? (
                      issue.history.map((entry, index) => (
                        <p key={`${issue._id}-${index}`} className="text-xs text-slate-300">
                          {toDateTimeLocal(entry.changedAt)} - {entry.status}
                          {entry.note ? ` (${entry.note})` : ''}
                        </p>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400">No history found.</p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      </div>
    </PageWrapper>
  )
}

export default MemberDashboard
