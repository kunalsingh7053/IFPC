import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import Loader from '../components/Loader'
import PageWrapper from '../components/PageWrapper'
import { clearAuthSession } from '../utils/authSession'

function ProfilePage() {
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

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

  async function handleProfileImageUpload() {
    if (!selectedFile) {
      setUploadError('Please choose an image first')
      setUploadSuccess('')
      return
    }

    const endpoint = role === 'admin' ? '/auth/profile' : '/users/profile'
    const formData = new FormData()
    formData.append('profileImage', selectedFile)

    try {
      setUploadLoading(true)
      setUploadError('')
      setUploadSuccess('')

      await API.patch(endpoint, formData)

      const { data } = await API.get(endpoint)
      setProfile(data)
      setSelectedFile(null)
      setUploadSuccess('Profile photo updated successfully')
    } catch (err) {
      const message = err?.response?.data?.message
      setUploadError(message || 'Failed to update profile photo')
      setUploadSuccess('')
    } finally {
      setUploadLoading(false)
    }
  }

  async function handleLogout() {
    try {
      setLogoutLoading(true)

      if (role === 'admin') {
        await API.post('/auth/logout')
      } else if (role === 'member') {
        await API.post('/users/logout')
      }
    } catch {
      // Force local logout even when server call fails.
    } finally {
      clearAuthSession()
      navigate('/login', { replace: true })
      setLogoutLoading(false)
    }
  }

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

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-slate-100">Change Profile Photo</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0] || null
                  setSelectedFile(file)
                  setUploadError('')
                  setUploadSuccess('')
                }}
                className="block w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-200 hover:file:bg-emerald-500/30"
              />

              <button
                type="button"
                onClick={handleProfileImageUpload}
                disabled={uploadLoading || !selectedFile}
                className="rounded-xl border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadLoading ? 'Uploading...' : 'Upload Photo'}
              </button>
            </div>

            {uploadError && <p className="mt-2 text-sm text-rose-300">{uploadError}</p>}
            {uploadSuccess && <p className="mt-2 text-sm text-emerald-300">{uploadSuccess}</p>}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="rounded-xl border border-rose-300/30 bg-rose-500/15 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logoutLoading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </PageWrapper>
  )
}

export default ProfilePage
