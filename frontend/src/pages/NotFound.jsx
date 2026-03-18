import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-6xl font-black text-white">404</h1>
      <p className="text-slate-300">This page does not exist.</p>
      <Link to="/" className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-5 py-3 font-semibold text-white">
        Back Home
      </Link>
    </div>
  )
}

export default NotFound
