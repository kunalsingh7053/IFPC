import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'

function Contact() {
  return (
    <PageWrapper>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/85 via-slate-900/75 to-emerald-950/75 p-4 shadow-[0_22px_55px_rgba(0,0,0,0.35)] sm:p-6 lg:p-8"
      >
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-6">
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-white/12 bg-white/5 p-5 backdrop-blur-md sm:p-6"
          >
            <p className="inline-flex rounded-full border border-emerald-300/35 bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-100">
              IFPC Community Location
            </p>
            <h1 className="mt-3 text-2xl font-black text-white sm:text-3xl">Visit Us at MediCaps University</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
              Find Ikshana Film and Photography Community (IFPC) at MediCaps University, Indore. We are available for
              student collaborations, event coverage, and creative media projects.
            </p>

            <div className="mt-4 space-y-2 text-sm text-slate-200">
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Location: MediCaps University, Indore</p>
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Community: IFPC (Film and Photography)</p>
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">Email: mulens@medicaps.ac.in</p>
            </div>

            <a
              href="https://www.instagram.com/ifp_community_/"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-xl border border-emerald-300/35 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
            >
              Follow on Instagram
            </a>

            <form className="mt-6 space-y-4 border-t border-white/10 pt-5">
              <input className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400" placeholder="Your name" />
              <input className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400" placeholder="Your email" />
              <textarea className="min-h-28 w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-slate-100 placeholder:text-slate-400" placeholder="Message" />
              <button className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(34,211,238,0.28)] transition hover:brightness-110 sm:w-auto">
                Send Message
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="rounded-2xl border border-white/12 bg-slate-950/45 p-3 sm:p-4"
          >
            <div className="map-frame relative overflow-hidden rounded-xl border border-emerald-300/20 bg-black/30 shadow-[0_18px_45px_rgba(0,0,0,0.38)]">
              <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
                IFPC • MediCaps University, Indore
              </div>
              <div className="aspect-[4/3] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14731.44679035643!2d75.79656220326918!3d22.62163919480653!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962f958dcb7169d%3A0xd877c12078e50f0f!2sMedicaps%20University%20-%20Private%20University%20in%20Indore!5e0!3m2!1sen!2sin!4v1774160535256!5m2!1sen!2sin"
                  className="h-full w-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="IFPC Community Location at MediCaps University Indore"
                />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <a
                href="https://maps.google.com/?q=Medicaps+University+Indore"
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-500/20"
              >
                Open in Google Maps
              </a>
              <a
                href="/about"
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/20"
              >
                About IFPC
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </PageWrapper>
  )
}

export default Contact
