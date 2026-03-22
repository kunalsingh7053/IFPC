import { useEffect, useMemo, useRef, useState } from 'react'
import API from '../api/axios'

const STARTER_MESSAGES = [
  {
    id: 'welcome',
    role: 'bot',
    text: 'Hi! I am IFPC Assistant. Ask me about IFPC only: about IFPC, president, location, team, or events.',
  },
]

function IFPCFaqChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(STARTER_MESSAGES)
  const [presidentName, setPresidentName] = useState('')
  const [vicePresidentName, setVicePresidentName] = useState('')
  const listRef = useRef(null)
  const rootRef = useRef(null)

  useEffect(() => {
    async function fetchLeaders() {
      try {
        const { data } = await API.get('/users/public-members')
        const members = Array.isArray(data?.data) ? data.data : []

        const president = members.find((member) => {
          const position = String(member?.position || '').trim().toLowerCase()
          return position === 'president' || position === 'presedent'
        })

        const vice = members.find((member) => {
          const position = String(member?.position || '').trim().toLowerCase()
          return position === 'vice-president'
        })

        const formatName = (member) => {
          const first = member?.fullName?.firstName || ''
          const last = member?.fullName?.lastName || ''
          return `${first} ${last}`.trim()
        }

        setPresidentName(formatName(president))
        setVicePresidentName(formatName(vice))
      } catch {
        setPresidentName('')
        setVicePresidentName('')
      }
    }

    fetchLeaders()
  }, [])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (!open) return undefined

    const handleClickOutside = (event) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  useEffect(() => {
    return () => {
      document.body.classList.remove('cursor-native-zone')
    }
  }, [])

  const suggestions = useMemo(
    () => ['What is IFPC?', 'Who is the president?', 'Where is IFPC located?', 'Tell me about IFPC team'],
    []
  )

  function getReply(text) {
    const q = text.trim().toLowerCase()

    const presidentKeywords = /president|presedent|leader|head/
    const locationKeywords = /location|located|where|address|place/
    const aboutKeywords = /what is ifpc|about ifpc|ifpc|full form|community/
    const teamKeywords = /team|members|vice president|core/
    const eventKeywords = /event|workshop|shoot|coverage/

    if (presidentKeywords.test(q)) {
      if (presidentName) {
        const viceLine = vicePresidentName ? ` Vice President: ${vicePresidentName}.` : ''
        return `Current IFPC President: ${presidentName}.${viceLine}`
      }
      return 'President details are managed by IFPC admin. You can check the Team page for the latest president and vice president.'
    }

    if (locationKeywords.test(q)) {
      return 'IFPC is based at MediCaps University, Indore, Madhya Pradesh. You can also view the location on the Contact page map.'
    }

    if (teamKeywords.test(q)) {
      return 'IFPC team includes President, Vice President, Heads, Core Members, and Members. Visit the Team page to view complete profiles.'
    }

    if (eventKeywords.test(q)) {
      return 'IFPC covers university events, cultural programs, workshops, seminars, photography sessions, and film-making activities.'
    }

    if (aboutKeywords.test(q)) {
      return 'IFPC stands for Ikshana Film and Photography Community, the official photography and film-making community of MediCaps University, Indore.'
    }

    return 'I reply only to IFPC-related questions. Please ask about IFPC, president, location, team, or events.'
  }

  function pushMessage(text) {
    const clean = text.trim()
    if (!clean) return

    const userMessage = { id: `u-${Date.now()}`, role: 'user', text: clean }
    const botMessage = { id: `b-${Date.now()}-${Math.random()}`, role: 'bot', text: getReply(clean) }
    setMessages((prev) => [...prev, userMessage, botMessage])
    setInput('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    pushMessage(input)
  }

  function enableNativeCursorZone() {
    document.body.classList.add('cursor-native-zone')
  }

  function disableNativeCursorZone() {
    document.body.classList.remove('cursor-native-zone')
  }

  return (
    <div
      ref={rootRef}
      onMouseEnter={enableNativeCursorZone}
      onMouseLeave={disableNativeCursorZone}
      className="chatbot-native-cursor fixed bottom-4 right-4 z-[11000]"
    >
      {open ? (
        <div className="w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-white/15 bg-slate-950/90 shadow-[0_18px_55px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-600/30 to-amber-500/25 px-4 py-3">
            <div>
              <h3 className="text-sm font-bold text-white">IFPC Assistant</h3>
              <p className="text-[11px] text-slate-200">IFPC only FAQ chatbot</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-white/20 px-2 py-1 text-xs text-white hover:bg-white/10"
            >
              Close
            </button>
          </div>

          <div ref={listRef} className="max-h-72 space-y-2 overflow-y-auto px-3 py-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-cyan-500/85 text-white'
                      : 'border border-white/10 bg-white/8 text-slate-100'
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 px-3 pb-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => pushMessage(suggestion)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-slate-200 hover:bg-white/10"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask IFPC question..."
                className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/85 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.45)] backdrop-blur-xl hover:bg-slate-800/95"
        >
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.7)]" />
          Ask IFPC Bot
        </button>
      )}
    </div>
  )
}

export default IFPCFaqChatbot
