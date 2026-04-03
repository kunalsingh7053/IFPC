import { useEffect, useMemo, useRef, useState } from 'react'
import API from '../api/axios'
import MessageBubble from './MessageBubble'

function ChatBox() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const role = localStorage.getItem('role')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = role === 'admin' ? user?.id : user?.id

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [messages],
  )

  async function fetchMessages() {
    try {
      const { data } = await API.get('/chat/messages')
      setMessages(data?.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load messages')
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError('')
    try {
      await API.post('/chat/messages', { message: text })
      setText('')
      await fetchMessages()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  async function removeMessage(id) {
    try {
      await API.delete(`/chat/messages/${id}`)
      await fetchMessages()
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed')
    }
  }

  useEffect(() => {
    fetchMessages()
    const timer = setInterval(fetchMessages, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sortedMessages])

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70">
      <div className="h-[45vh] max-h-[60vh] space-y-3 overflow-y-auto p-4 md:h-[55vh] md:max-h-none">
        {sortedMessages.map((msg) => {
          const mine = String(msg.senderId) === String(userId)
          const canDelete = role === 'admin' || mine

          return (
            <div key={msg._id} className="space-y-1">
              <MessageBubble message={msg} mine={mine} />
              {canDelete && (
                <div className={`text-xs ${mine ? 'text-right' : 'text-left'}`}>
                  <button
                    onClick={() => removeMessage(msg._id)}
                    className="text-rose-300 transition hover:text-rose-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none"
          />
          <button
            disabled={loading}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white disabled:opacity-70"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
      </form>
    </div>
  )
}

export default ChatBox
