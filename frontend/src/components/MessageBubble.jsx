import { Trash2 } from "lucide-react"

function MessageBubble({ message, mine, onDelete, canDelete }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  const avatarUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
    message.senderName || "User"
  )}`

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} mb-3`}>
      
      <div className={`flex items-end gap-2 max-w-[80%] ${mine ? "flex-row-reverse" : ""}`}>

        {/* Avatar */}
        <img
          src={avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full flex-shrink-0"
        />

        <div className="relative group">

          {/* MESSAGE BOX */}
          <div
            className={`px-4 py-2 text-sm shadow rounded-2xl relative ${
              mine
                ? "bg-[#25D366] text-black"
                : "bg-white text-black"
            }`}
          >
            {/* Text */}
            <p className="break-words whitespace-pre-wrap">
              {message.message}
            </p>

            {/* Time */}
            <div className="text-[10px] text-right mt-1 opacity-60">
              {time}
            </div>

            {/* Delete Icon */}
            {canDelete && (
              <button
                onClick={() => onDelete(message._id)}
                className={`absolute top-1 ${
                  mine ? "left-1" : "right-1"
                } opacity-0 group-hover:opacity-100 transition`}
              >
                <Trash2
                  size={14}
                  className="text-black/60 hover:text-red-500"
                />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble