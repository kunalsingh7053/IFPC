import { useState } from 'react'
import API from '../api/axios'
import FormInput from './FormInput'

const initialForm = {
  date: new Date().toISOString().split('T')[0],
  items: '',
  paidBy: '',
  paidTo: '',
  paymentMode: 'cash',
  amount: '',
  remark: '',
}

function AddFundsForm({ onClose = null, onSuccess = null, editingFund = null }) {
  const [form, setForm] = useState(editingFund || initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    if (!form.date || !form.items || !form.paidBy || !form.paidTo || !form.amount) {
      setError('All required fields must be filled')
      setLoading(false)
      return
    }

    if (form.amount <= 0) {
      setError('Amount must be greater than 0')
      setLoading(false)
      return
    }

    try {
      const payload = {
        date: form.date,
        items: form.items,
        paidBy: form.paidBy,
        paidTo: form.paidTo,
        paymentMode: form.paymentMode,
        amount: parseFloat(form.amount),
        remark: form.remark,
      }

      let newFund
      if (editingFund?._id) {
        await API.patch(`/funds/${editingFund._id}`, payload)
        setMessage('Fund entry updated successfully')
      } else {
        const response = await API.post('/funds', payload)
        newFund = response?.data?.data
        setMessage('Fund entry added successfully')
      }

      setTimeout(() => {
        onSuccess?.(newFund)
        onClose?.()
      }, 1000)
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.response?.data?.message || 'Failed to save fund entry'
      setError(errorMsg)
      console.error('Fund save error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0f172a] p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-white">
            {editingFund ? 'Edit Fund Entry' : 'Add New Fund Entry'}
          </h3>
          <button
            onClick={onClose}
            type="button"
            className="text-2xl text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <FormInput
              label="Amount"
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
            />

            <FormInput
              label="Items"
              name="items"
              value={form.items}
              onChange={handleChange}
              placeholder="What was purchased"
              required
            />

            <FormInput
              label="Paid By"
              name="paidBy"
              value={form.paidBy}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              required
            />

            <FormInput
              label="Paid To"
              name="paidTo"
              value={form.paidTo}
              onChange={handleChange}
              placeholder="e.g., Vendor Name"
              required
            />

            <div>
              <label className="block text-sm text-slate-200 mb-1">Payment Mode</label>
              <select
                name="paymentMode"
                value={form.paymentMode}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-white outline-none focus:border-emerald-400/60 focus:bg-slate-900/90 focus:ring-2 focus:ring-emerald-400/20"
                style={{ colorScheme: 'dark' }}
              >
                <option value="cash" className="bg-slate-900 text-white">Cash</option>
                <option value="bank-transfer" className="bg-slate-900 text-white">Bank Transfer</option>
                <option value="upi" className="bg-slate-900 text-white">UPI</option>
                <option value="cheque" className="bg-slate-900 text-white">Cheque</option>
                <option value="other" className="bg-slate-900 text-white">Other</option>
              </select>
            </div>
          </div>

          <FormInput
            label="Remark (Optional)"
            name="remark"
            value={form.remark}
            onChange={handleChange}
            placeholder="Add any additional notes"
          />

          {error && <p className="text-sm text-rose-300">{error}</p>}
          {message && <p className="text-sm text-emerald-300">{message}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 py-3 font-semibold text-slate-950 hover:scale-[1.01]"
            >
              {loading ? 'Saving...' : editingFund ? 'Update Entry' : 'Add Entry'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFundsForm
