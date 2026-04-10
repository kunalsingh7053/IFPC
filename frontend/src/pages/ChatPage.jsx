import PageWrapper from '../components/PageWrapper'
import ChatBox from '../components/ChatBox'

function ChatPage() {
  return (
    <PageWrapper>
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Community Chat</h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          A focused space for members and admins to coordinate event tasks, updates, and discussions.
        </p>
        <div className="mt-6">
          <ChatBox />
        </div>
      </div>
    </PageWrapper>
  )
}

export default ChatPage
