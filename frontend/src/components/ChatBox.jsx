import { useEffect, useMemo, useRef, useState } from 'react'
import API from '../api/axios'
import MessageBubble from './MessageBubble'

function ChatBox() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  const role = localStorage.getItem('role')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const userId = user?.id || user?._id

  const maxMessageLength = 600

  // ✅ STABLE SORT (fix order issue)
  const sortedMessages = useMemo(() => {
    const map = new Map()

    messages.forEach((msg) => {
      map.set(msg._id, msg)
    })

    return Array.from(map.values()).sort((a, b) => {
      const t1 = new Date(a.createdAt).getTime()
      const t2 = new Date(b.createdAt).getTime()

      if (t1 === t2) {
        return String(a._id).localeCompare(String(b._id))
      }

      return t1 - t2
    })
  }, [messages])

  // ✅ FETCH + MERGE
  async function fetchMessages(isInitial = false) {
    if (isInitial) setInitialLoading(true)

    try {
      const { data } = await API.get('/chat/messages')
      const newMessages = data?.data || []

      setMessages((prev) => {
        const map = new Map()

        prev.forEach((msg) => map.set(msg._id, msg))
        newMessages.forEach((msg) => map.set(msg._id, msg))

        return Array.from(map.values())
      })

      setError('')
    } catch (err) {
      setError(err?.response?.data?.message || 'Load failed')
    } finally {
      if (isInitial) setInitialLoading(false)
    }
  }

  // ✅ SEND MESSAGE (optimistic UI)
  async function sendMessage(e) {
    e.preventDefault()

    const clean = text.trim()
    if (!clean) return

    if (clean.length > maxMessageLength) {
      setError(`Max ${maxMessageLength} characters`)
      return
    }

    const tempId = Date.now().toString()

    const tempMessage = {
      _id: tempId,
      message: clean,
      senderId: userId,
      senderName: user?.name || 'You',
      senderType: role,
      createdAt: new Date(Date.now() + Math.random()).toISOString(),
    }

    // 🔥 instant UI update
    setMessages((prev) => [...prev, tempMessage])
    setText('')
    setLoading(true)

    try {
      const { data } = await API.post('/chat/messages', {
        message: clean,
      })

      const realMessage = data?.data

      // replace temp message
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? realMessage : msg
        )
      )
    } catch (err) {
      setError(err?.response?.data?.message || 'Send failed')

      // remove failed message
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== tempId)
      )
    } finally {
      setLoading(false)
    }
  }

  // ✅ DELETE MESSAGE
  async function removeMessage(id) {
    try {
      await API.delete(`/chat/messages/${id}`)
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== id)
      )
    } catch (err) {
      setError('Delete failed')
    }
  }

  // 🔁 polling
  useEffect(() => {
    fetchMessages(true)

    const timer = setInterval(() => {
      if (!loading) fetchMessages()
    }, 3000)

    return () => clearInterval(timer)
  }, [loading])

  // ⬇️ auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [sortedMessages])

  return (
    <div className="flex flex-col h-[600px] rounded-2xl overflow-hidden border border-white/10">

      {/* HEADER */}
      <div className="bg-[#075E54] text-white px-4 py-3 font-semibold">
        Community Chat
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto bg-[#e5ddd5] px-3 py-3">
        {initialLoading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : sortedMessages.length === 0 ? (
          <p className="text-center text-gray-600">No messages</p>
        ) : (
          sortedMessages.map((msg) => {
            const mine = String(msg.senderId) === String(userId)
            const canDelete = role === 'admin' || mine

            return (
              <MessageBubble
                key={msg._id}
                message={msg}
                mine={mine}
                onDelete={removeMessage}
                canDelete={canDelete}
              />
            )
          })
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={sendMessage} className="bg-[#f0f0f0] p-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full outline-none"
        />

        <button
          disabled={!text.trim() || loading}
          className="bg-[#25D366] text-white px-4 rounded-full disabled:opacity-50"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-500 px-3 pb-2">{error}</p>
      )}
    </div>
  )
}

export default ChatBox