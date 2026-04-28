import { useEffect, useState } from 'react'
import API from '../api/axios'

function FundsPanel({ isAdmin = false, onAddClick = null, funds: propFunds = null, summary: propSummary = null, onFundDeleted = null }) {
  const [funds, setFunds] = useState(propFunds || [])
  const [summary, setSummary] = useState(propSummary || null)
  const [loading, setLoading] = useState(!propFunds)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  async function loadFunds() {
    try {
      setLoading(true)
      setError('')

      const [fundsRes, summaryRes] = await Promise.all([
        API.get('/funds'),
        API.get('/funds/summary'),
      ])

      setFunds(Array.isArray(fundsRes?.data?.data) ? fundsRes.data.data : [])
      setSummary(summaryRes?.data?.data || null)
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to load funds'
      setError(errorMsg)
      console.error('Funds load error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (propFunds) {
      setFunds(propFunds)
      setSummary(propSummary)
      setLoading(false)
    } else {
      loadFunds()
    }
  }, [propFunds, propSummary])

  async function handleDownloadInvoice() {
    try {
      const response = await API.get('/funds/invoice/download', {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `IFPC_Funds_Invoice_${new Date().getTime()}.html`)
      document.body.appendChild(link)
      link.click()
      link.parentChild.removeChild(link)
    } catch (err) {
      alert('Failed to download invoice')
    }
  }

  async function handleDelete(fundId) {
    if (!window.confirm('Are you sure you want to delete this fund entry?')) {
      return
    }

    try {
      setDeleteLoading(fundId)
      setError('')
      setMessage('')

      await API.delete(`/funds/${fundId}`)
      
      setMessage('Fund entry deleted successfully')
      if (onFundDeleted) {
        onFundDeleted()
      } else {
        await loadFunds()
      }
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to delete fund entry'
      setError(errorMsg)
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-semibold text-white">Funds Management</h3>
          <p className="mt-1 text-sm text-slate-400">Track and manage financial transactions</p>
        </div>

        <div className="flex gap-2">
          {isAdmin && onAddClick && (
            <button
              onClick={onAddClick}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              + Add Fund
            </button>
          )}
          {isAdmin && (
            <button
              onClick={handleDownloadInvoice}
              className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
            >
              📥 Invoice
            </button>
          )}
        </div>
      </div>

      {summary && (
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <article className="rounded-xl border border-emerald-300/35 bg-emerald-500/10 p-3">
            <p className="text-xs uppercase tracking-[0.13em] text-emerald-100">Total Amount</p>
            <p className="mt-1 text-2xl font-bold text-emerald-100">₹{summary.totalAmount?.toLocaleString() || '0'}</p>
          </article>
          <article className="rounded-xl border border-blue-300/35 bg-blue-500/10 p-3">
            <p className="text-xs uppercase tracking-[0.13em] text-blue-100">Transactions</p>
            <p className="mt-1 text-2xl font-bold text-blue-100">{summary.totalTransactions || '0'}</p>
          </article>
          <article className="rounded-xl border border-purple-300/35 bg-purple-500/10 p-3">
            <p className="text-xs uppercase tracking-[0.13em] text-purple-100">Payment Modes</p>
            <p className="mt-1 text-2xl font-bold text-purple-100">{Object.keys(summary.byPaymentMode || {}).length}</p>
          </article>
        </div>
      )}

      {loading && <p className="text-center text-slate-400">Loading funds...</p>}

      {error && <p className="text-center text-rose-300">{error}</p>}

      {message && <p className="text-center text-emerald-300">{message}</p>}

      {!loading && !error && funds.length === 0 && (
        <p className="text-center text-slate-400">No fund entries yet</p>
      )}

      {!loading && !error && funds.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200">Items</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200">Paid By</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200">Paid To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200">Mode</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-200">Amount</th>
                {isAdmin && <th className="px-4 py-3 text-center text-xs font-semibold text-slate-200">Action</th>}
              </tr>
            </thead>
            <tbody>
              {funds.slice(0, 10).map((fund) => (
                <tr key={fund._id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-slate-300">{new Date(fund.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-300">{fund.items}</td>
                  <td className="px-4 py-3 text-slate-300">{fund.paidBy}</td>
                  <td className="px-4 py-3 text-slate-300">{fund.paidTo}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-200">{fund.paymentMode}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-300">₹{fund.amount.toLocaleString()}</td>
                  {isAdmin && (
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(fund._id)}
                        disabled={deleteLoading === fund._id}
                        className="rounded-lg border border-rose-300/40 bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-500/30 disabled:opacity-60"
                      >
                        {deleteLoading === fund._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {funds.length > 10 && (
        <p className="mt-3 text-center text-xs text-slate-400">
          Showing 10 of {funds.length} entries (full list in invoice download)
        </p>
      )}
    </div>
  )
}

export default FundsPanel
