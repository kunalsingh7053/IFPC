function MessageBubble({ message, mine }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const avatar = message.senderName?.slice(0, 1)?.toUpperCase() || 'U'
  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
    message.senderName || 'IFPC User',
  )}`
  const isAdminMessage = message.senderType === 'admin'

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex w-full max-w-[92%] items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/20 bg-slate-700/60 shadow-md shadow-black/20">
          <img src={avatarUrl} alt={avatar} className="h-full w-full object-cover" />
        </div>

        <div
          className={`rounded-2xl px-4 py-3 shadow-lg shadow-black/20 ${
            mine
              ? 'rounded-br-sm bg-gradient-to-r from-emerald-500 to-green-500 text-white'
              : 'rounded-bl-sm border border-white/12 bg-white/10 text-slate-100 backdrop-blur-sm'
          }`}
        >
          <div className={`mb-1.5 flex items-center gap-2 ${mine ? 'justify-end' : 'justify-start'}`}>
            <p className={`text-xs font-semibold ${mine ? 'text-emerald-50' : 'text-slate-200'}`}>
              {message.senderName}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                isAdminMessage
                  ? mine
                    ? 'bg-white/20 text-white'
                    : 'bg-cyan-500/20 text-cyan-200 border border-cyan-300/30'
                  : mine
                  ? 'bg-white/20 text-white'
                  : 'bg-emerald-500/20 text-emerald-200 border border-emerald-300/30'
              }`}
            >
              {isAdminMessage ? 'Admin' : 'Member'}
            </span>
          </div>

          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.message}</p>

          <p className={`mt-2 text-[10px] ${mine ? 'text-emerald-100/90 text-right' : 'text-slate-400'}`}>
            {time}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
