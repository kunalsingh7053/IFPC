import { IFPC_LOGO_URL } from '../utils/branding'

function Footer() {
  return (
    <footer className="mt-8 w-full border-t border-emerald-300/20 bg-[linear-gradient(160deg,rgba(4,8,18,0.95),rgba(8,14,28,0.9))] px-4 py-8 md:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={IFPC_LOGO_URL}
              alt="IFPC logo"
              className="h-11 w-11 rounded-full border border-emerald-300/45 object-cover shadow-[0_0_22px_rgba(56,189,248,0.35)]"
            />
            <div>
              <p className="text-lg font-black text-emerald-200">IFPC</p>
              <p className="text-xs text-slate-300">Ikshana Film and Photography Community</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-300">MediCaps University, Indore</p>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-100">Quick Links</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-300">
            <a href="/" className="hover:text-emerald-200">Home</a>
            <a href="/about" className="hover:text-emerald-200">About</a>
            <a href="/gallery" className="hover:text-emerald-200">Gallery</a>
            <a href="/team" className="hover:text-emerald-200">Team</a>
            <a href="/contact" className="hover:text-emerald-200">Contact</a>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-emerald-100">Social</p>
          <div className="mt-3 flex items-center gap-3">
            <a
              href="https://www.instagram.com/ifp_community_/"
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-slate-100 hover:border-emerald-300/50 hover:text-emerald-200"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
              </svg>
            </a>
            <a
              href="mailto:ifpc@medicaps.ac.in"
              className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-slate-100 hover:border-emerald-300/50 hover:text-emerald-200"
              aria-label="Email"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.2l9 5.8 9-5.8V7H3Zm18 10V9.5l-8.46 5.45a1 1 0 0 1-1.08 0L3 9.5V17h18Z" />
              </svg>
            </a>
            <a
              href="tel:+910000000000"
              className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-slate-100 hover:border-emerald-300/50 hover:text-emerald-200"
              aria-label="Phone"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                <path d="M6.62 10.79a15.54 15.54 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.31.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1c0 1.26.2 2.45.57 3.57a1 1 0 0 1-.24 1.02l-2.2 2.2Z" />
              </svg>
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-400">Modernized with React, Tailwind CSS and Framer Motion</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
