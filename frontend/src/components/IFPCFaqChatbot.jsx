import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import API from '../api/axios'

const STARTER_MESSAGES = [
  {
    id: 'welcome',
    role: 'bot',
    text: 'Welcome Commander. I am IFPC AI. Ask me about IFPC, team, events, and campus activities.',
  },
]

const QUICK_REPLIES = [
  'What is IFPC?',
  'Who is the president?',
  'Where is IFPC located?',
  'Tell me upcoming events',
]

function IFPCFaqChatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(STARTER_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [presidentName, setPresidentName] = useState('')
  const [vicePresidentName, setVicePresidentName] = useState('')
  const listRef = useRef(null)
  const rootRef = useRef(null)
  const recognitionRef = useRef(null)
  const transcriptBufferRef = useRef('')

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
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setVoiceSupported(Boolean(SpeechRecognition && window.speechSynthesis))

    if (!SpeechRecognition) return undefined

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart = () => {
      transcriptBufferRef.current = ''
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      let transcript = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript
      }
      transcriptBufferRef.current = transcript.trim()
      setInput(transcriptBufferRef.current)
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (transcriptBufferRef.current) {
        handleSend(transcriptBufferRef.current, { fromVoice: true })
        transcriptBufferRef.current = ''
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognitionRef.current?.stop()
      recognitionRef.current = null
    }
  }, [presidentName, vicePresidentName])

  useEffect(() => {
    if (!open) return
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
    }
  }, [])

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

  const suggestions = useMemo(() => QUICK_REPLIES, [])

  function getReply(text, history = []) {
    const q = text.trim().toLowerCase()
    const previousContext = history.slice(-4).map((item) => item.text.toLowerCase()).join(' ')

    const presidentKeywords = /president|presedent|leader|head/
    const locationKeywords = /location|located|where|address|place/
    const aboutKeywords = /what is ifpc|about ifpc|ifpc|full form|community/
    const teamKeywords = /team|members|vice president|core/
    const eventKeywords = /event|workshop|shoot|coverage/
    const followUpKeywords = /where is it|where is this|what about location|tell me more/

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

    if (followUpKeywords.test(q) && previousContext.includes('ifpc')) {
      return 'IFPC is based at MediCaps University, Indore. For exact navigation, open the Contact page map section.'
    }

    return 'I reply only to IFPC-related questions. Please ask about IFPC, president, location, team, or events.'
  }

  async function requestAssistantReply(userMessage, history) {
    const endpoint = import.meta.env.VITE_ASSISTANT_API_URL

    if (!endpoint) {
      return getReply(userMessage, history)
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userMessage,
          messages: history.slice(-10),
          context: {
            scope: 'IFPC website assistant',
            presidentName,
            vicePresidentName,
          },
        }),
      })

      const data = await response.json()
      const aiText = String(data?.reply || data?.message || '').trim()
      if (aiText) return aiText
      return getReply(userMessage, history)
    } catch {
      return getReply(userMessage, history)
    }
  }

  function speak(text) {
    if (!window.speechSynthesis) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.pitch = 0.95
    utterance.rate = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  async function typeAndPushBotMessage(fullText, shouldSpeak = false) {
    const botMessageId = `b-${Date.now()}-${Math.random()}`

    setMessages((prev) => [...prev, { id: botMessageId, role: 'bot', text: '' }])
    setIsTyping(true)

    const words = fullText.split(' ')
    let buffer = ''

    for (let index = 0; index < words.length; index += 1) {
      buffer += `${index === 0 ? '' : ' '}${words[index]}`

      setMessages((prev) =>
        prev.map((message) =>
          message.id === botMessageId
            ? {
                ...message,
                text: buffer,
              }
            : message
        )
      )

      await new Promise((resolve) => {
        window.setTimeout(resolve, words[index].length > 7 ? 58 : 40)
      })
    }

    setIsTyping(false)
    if (shouldSpeak) {
      speak(fullText)
    }
  }

  async function handleSend(text, options = {}) {
    const clean = text.trim()
    if (!clean) return

    if (isTyping) return

    const { fromVoice = false } = options

    const userMessage = { id: `u-${Date.now()}`, role: 'user', text: clean }
    const historySnapshot = [...messages, userMessage]
    setMessages(historySnapshot)
    setInput('')

    const reply = await requestAssistantReply(clean, historySnapshot)
    await typeAndPushBotMessage(reply, fromVoice)
  }

  function handleSubmit(event) {
    event.preventDefault()
    handleSend(input, { fromVoice: false })
  }

  function toggleListening() {
    if (!voiceSupported || !recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      return
    }

    recognitionRef.current.start()
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
      className="chatbot-native-cursor fixed bottom-16 left-4 z-[11000] sm:bottom-7 sm:left-7"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="w-[min(94vw,410px)] overflow-hidden rounded-3xl border border-indigo-300/20 bg-[linear-gradient(145deg,rgba(6,10,28,0.9),rgba(10,18,42,0.88))] shadow-[0_24px_70px_rgba(0,0,0,0.56)] backdrop-blur-2xl"
          >
            <div className="relative overflow-hidden border-b border-white/10 px-4 py-3">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.28),transparent_45%),radial-gradient(circle_at_80%_40%,rgba(139,92,246,0.3),transparent_42%)]" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-10 w-10 place-items-center rounded-full border border-indigo-300/35 bg-indigo-500/15">
                    <motion.div
                      animate={{ scale: isSpeaking ? [1, 1.28, 1] : [1, 1.08, 1], opacity: isSpeaking ? [0.45, 0.12, 0.45] : [0.35, 0.18, 0.35] }}
                      transition={{ duration: isSpeaking ? 0.68 : 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/40 to-violet-500/45 blur-[1px]"
                    />
                    <span className="relative h-3 w-3 rounded-full bg-gradient-to-r from-blue-300 to-violet-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">IFPC JARVIS</h3>
                    <p className="text-[11px] text-slate-300">Voice + Context Assistant</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-white/20 px-2 py-1 text-xs text-white hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>

            <div ref={listRef} className="max-h-80 space-y-2 overflow-y-auto px-3 py-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <p
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500/90 to-violet-500/85 text-white'
                        : 'border border-white/10 bg-white/7 text-slate-100'
                    }`}
                  >
                    {message.text}
                  </p>
                </motion.div>
              ))}

              {isTyping ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-white/8 px-3 py-2 text-xs text-slate-200">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300 [animation-delay:-0.2s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300 [animation-delay:-0.1s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blue-300" />
                    </span>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 px-3 pb-3">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSend(suggestion, { fromVoice: false })}
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
                  placeholder={isListening ? 'Listening...' : 'Ask IFPC question...'}
                  className="flex-1 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-400"
                />

                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={!voiceSupported}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold text-white ${
                    isListening
                      ? 'border-rose-300/60 bg-rose-500/40'
                      : 'border-indigo-300/40 bg-indigo-500/30 hover:bg-indigo-500/45'
                  } ${!voiceSupported ? 'cursor-not-allowed opacity-45' : ''}`}
                >
                  Mic
                </button>

                <button
                  type="submit"
                  disabled={isTyping}
                  className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-55"
                >
                  Send
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                <span>{voiceSupported ? 'Voice mode: click Mic to listen' : 'Voice unavailable in this browser'}</span>
                <span className="inline-flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${isListening ? 'bg-rose-300' : isSpeaking ? 'bg-blue-300' : 'bg-slate-500'}`} />
                  {isListening ? 'Listening' : isSpeaking ? 'AI speaking' : 'Idle'}
                </span>
              </div>

              {isSpeaking ? (
                <div className="mt-2 flex items-end gap-1">
                  {[0, 1, 2, 3, 4].map((bar) => (
                    <motion.span
                      key={bar}
                      animate={{ height: [6, 14 + (bar % 2) * 8, 7] }}
                      transition={{ duration: 0.45, repeat: Infinity, repeatType: 'mirror', delay: bar * 0.05 }}
                      className="w-1 rounded-full bg-gradient-to-t from-blue-400 to-violet-400"
                    />
                  ))}
                </div>
              ) : null}
            </form>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 rounded-full border border-indigo-300/30 bg-[linear-gradient(145deg,rgba(8,14,34,0.85),rgba(15,24,52,0.82))] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <span className="relative inline-flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-300/65" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-r from-blue-300 to-violet-300" />
            </span>
            AI Assistant
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

export default IFPCFaqChatbot
