import { useEffect, useState } from 'react'
import API from '../api/axios'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'

function ProfilePage() {
  const role = localStorage.getItem('role')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const endpoint = role === 'admin' ? '/auth/profile' : '/users/profile'
        const { data } = await API.get(endpoint)
        setProfile(data)
      } catch {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [role])

  if (loading) return <Loader label="Loading profile" />

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold text-white">Profile</h1>
      {!profile ? (
        <p className="mt-4 text-slate-300">Unable to load profile.</p>
      ) : (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-4">
            <img
              src={profile.profileImage || 'https://placehold.co/100x100/0f172a/38bdf8?text=IFPC'}
              alt="profile"
              className="h-20 w-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-slate-100">
                {profile.fullName?.firstName} {profile.fullName?.lastName}
              </h2>
              <p className="text-sm text-slate-300">{profile.email}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
            <p>Role: {role}</p>
            <p>Phone: {profile.phone || 'N/A'}</p>
            <p>Department: {profile.department || 'N/A'}</p>
            <p>Position: {profile.position || 'N/A'}</p>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}

export default ProfilePage
