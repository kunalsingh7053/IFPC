import PageWrapper from '../components/PageWrapper'
import ChatBox from '../components/ChatBox'

function ChatPage() {
  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Community Chat</h1>
      <p className="mt-2 text-slate-300">WhatsApp-style shared room for members and admins.</p>
      <div className="mt-5">
        <ChatBox />
      </div>
    </PageWrapper>
  )
}

export default ChatPage
