function MessageBubble({ message, mine }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  const avatar = message.senderName?.slice(0, 1)?.toUpperCase() || 'U'
  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
    message.senderName || 'IFPC User',
  )}`

  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-slate-700">
          <img src={avatarUrl} alt={avatar} className="h-full w-full object-cover" />
        </div>
        <div
          className={`rounded-2xl px-4 py-2 ${
            mine
              ? 'rounded-br-sm bg-gradient-to-r from-emerald-500 to-green-500 text-white'
              : 'rounded-bl-sm border border-white/10 bg-white/10 text-slate-100'
          }`}
        >
          <p className="text-xs font-semibold opacity-90">{message.senderName}</p>
          <p className="mt-1 text-sm">{message.message}</p>
          <p className="mt-1 text-right text-[10px] opacity-80">{time}</p>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
