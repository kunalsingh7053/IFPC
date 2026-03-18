import { useEffect, useState } from 'react'
import API from '../api/axios'
import MemberCard from '../components/MemberCard'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'

function MembersList() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMembers() {
      try {
        const { data } = await API.get('/users/members')
        setMembers(data?.data || data?.members || [])
      } catch {
        // Fallback placeholder if backend list API is unavailable
        setMembers([])
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Members List</h1>
      <p className="mt-2 text-slate-300">If backend list API is added, members will auto-appear here.</p>

      {loading ? (
        <Loader label="Loading members" />
      ) : members.length === 0 ? (
        <p className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">No members found yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <MemberCard key={member._id || member.email} member={member} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

export default MembersList
