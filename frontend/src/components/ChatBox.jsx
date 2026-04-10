import { useEffect, useMemo, useRef, useState } from 'react'
import API from '../api/axios'
import MessageBubble from './MessageBubble'

function ChatBox() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  const bottomRef = useRef(null)

  const role = localStorage.getItem('role')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user?.id || user?._id
  const maxMessageLength = 600

  const sortedMessages = useMemo(
    () => [...messages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)),
    [messages],
  )

  const participantCount = useMemo(() => {
    const uniqueSenderKeys = new Set(
      sortedMessages.map((msg) => `${msg.senderType || 'unknown'}-${String(msg.senderId || '')}`),
    )
    return uniqueSenderKeys.size
  }, [sortedMessages])

  async function fetchMessages(isInitial = false) {
    if (isInitial) {
      setInitialLoading(true)
    }

    try {
      const { data } = await API.get('/chat/messages')
      setMessages(data?.data || [])
      setError('')
      setLastSyncedAt(new Date())
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load messages')
    } finally {
      if (isInitial) {
        setInitialLoading(false)
      }
    }
  }

  async function sendMessage(e) {
    e.preventDefault()
    const cleanMessage = text.trim()
    if (!cleanMessage) return
    if (cleanMessage.length > maxMessageLength) {
      setError(`Message is too long. Max ${maxMessageLength} characters.`)
      return
    }

    setLoading(true)
    setError('')
    try {
      await API.post('/chat/messages', { message: cleanMessage })
      setText('')
      await fetchMessages()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const canSend = text.trim().length > 0 && !loading

  async function removeMessage(id) {
    try {
      await API.delete(`/chat/messages/${id}`)
      await fetchMessages()
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed')
    }
  }

  useEffect(() => {
    fetchMessages(true)
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchMessages()
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sortedMessages])

  return (
    <div className="overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(160deg,rgba(7,14,11,0.9),rgba(12,24,18,0.86))] shadow-2xl shadow-black/30 backdrop-blur-sm">
      <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">IFPC Community Room</h2>
            <p className="text-xs text-slate-400">Members and admins collaborate in one live thread with auto refresh every 5 seconds</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full border border-cyan-300/30 bg-cyan-500/10 px-2.5 py-1 font-medium text-cyan-200">
              {participantCount} active participants
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-medium text-slate-300">
              {lastSyncedAt
                ? `Synced ${lastSyncedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Syncing...'}
            </span>
            <button
              type="button"
              onClick={() => fetchMessages()}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-medium text-slate-200 hover:bg-white/10"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="h-[52dvh] max-h-[70dvh] space-y-4 overflow-y-auto px-3 py-4 sm:h-[58vh] sm:max-h-none sm:px-5">
        {initialLoading ? (
          <div className="space-y-3">
            <div className="h-16 w-2/3 animate-pulse rounded-2xl bg-white/10" />
            <div className="ml-auto h-16 w-1/2 animate-pulse rounded-2xl bg-emerald-500/25" />
            <div className="h-16 w-3/4 animate-pulse rounded-2xl bg-white/10" />
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="flex h-full min-h-[240px] items-center justify-center">
            <div className="max-w-md rounded-2xl border border-white/12 bg-white/[0.03] p-6 text-center">
              <p className="text-sm font-semibold text-slate-100">No messages yet</p>
              <p className="mt-1 text-sm text-slate-400">Start the first conversation for your community.</p>
            </div>
          </div>
        ) : (
          sortedMessages.map((msg) => {
            const mine = String(msg.senderId) === String(userId)
            const canDelete = role === 'admin' || mine

            return (
              <div key={msg._id} className="space-y-1.5">
                <MessageBubble message={msg} mine={mine} />
                {canDelete && (
                  <div className={`text-xs ${mine ? 'text-right pr-12' : 'text-left pl-12'}`}>
                    <button
                      onClick={() => removeMessage(msg._id)}
                      className="rounded-md px-1.5 py-0.5 text-rose-300 transition hover:bg-rose-500/10 hover:text-rose-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="border-t border-white/10 bg-black/10 p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage(e)
              }
            }}
            maxLength={maxMessageLength}
            rows={2}
            placeholder="Write a message... (Enter to send, Shift+Enter for new line)"
            className="max-h-36 min-h-[54px] flex-1 resize-y rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-400 focus:border-emerald-300/40 focus:bg-white/15"
          />
          <button
            disabled={!canSend}
            className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">Be respectful and keep discussions professional.</p>
          <p className="text-[11px] text-slate-400">
            {text.trim().length}/{maxMessageLength}
          </p>
        </div>
        {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}
      </form>
    </div>
  )
}

export default ChatBox
