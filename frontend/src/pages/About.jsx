import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'

const missionPoints = [
  { title: 'Promote photography and film making', icon: 'camera' },
  { title: 'Help students learn creative skills', icon: 'spark' },
  { title: 'Cover university events', icon: 'event' },
  { title: 'Provide media support', icon: 'support' },
  { title: 'Build strong creative team', icon: 'team' },
]

const whatWeDo = [
  'Event Photography',
  'Videography',
  'Film Making',
  'Editing',
  'Workshops',
  'Content Creation',
]

const teamRoles = [
  { name: 'President', accent: 'from-amber-400/45 to-orange-500/30' },
  { name: 'Vice President', accent: 'from-sky-400/40 to-cyan-500/25' },
  { name: 'Head', accent: 'from-emerald-400/35 to-teal-500/25' },
  { name: 'Core Members', accent: 'from-rose-400/35 to-fuchsia-500/25' },
  { name: 'Members', accent: 'from-violet-400/35 to-indigo-500/25' },
]

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-black text-white md:text-3xl">{title}</h2>
      {subtitle ? <p className="mt-2 max-w-3xl text-slate-300">{subtitle}</p> : null}
    </div>
  )
}

function GlassCard({ children, className = '' }) {
  return <div className={`rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl ${className}`}>{children}</div>
}

function MissionIcon({ type }) {
  const common = 'h-5 w-5 text-amber-200'

  if (type === 'camera') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
        <path d="M9 8 10.5 5h3L15 8" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    )
  }

  if (type === 'spark') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3v4M12 17v4M4.9 6.9l2.8 2.8M16.3 14.3l2.8 2.8M3 12h4M17 12h4M4.9 17.1l2.8-2.8M16.3 9.7l2.8-2.8" />
      </svg>
    )
  }

  if (type === 'event') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8">
        <path d="M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1Z" />
      </svg>
    )
  }

  if (type === 'support') {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8">
        <path d="M4 13a8 8 0 1 1 16 0v3a2 2 0 0 1-2 2h-2v-4h4" />
        <path d="M4 14h4v4H6a2 2 0 0 1-2-2v-2Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="10" r="2.4" />
      <circle cx="16" cy="10" r="2.4" />
      <path d="M4.5 18a4.5 4.5 0 0 1 7 0M12.5 18a4.5 4.5 0 0 1 7 0" />
    </svg>
  )
}

function About() {
  return (
    <PageWrapper>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: "url('/images/ifpc-icon.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-slate-900/70 to-cyan-950/75" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 p-8 md:p-12 lg:p-16"
        >
          <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.24em] text-slate-200">
            MediCaps University Indore
          </p>
          <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">
            Ikshana Film and Photography Community
          </h1>
          <p className="mt-3 text-lg text-slate-200">Official Photography Community of MediCaps University Indore</p>
          <p className="mt-2 text-amber-300">Capturing Moments, Creating Memories</p>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
      >
        <SectionTitle title="About IFPC" />
        <div className="space-y-4 text-slate-200">
          <p>
            Ikshana Film and Photography Community (IFPC) is the official photography and film making community of
            MediCaps University Indore.
          </p>
          <p>
            This community is created for students who are passionate about photography, videography, editing, and film
            making.
          </p>
          <p>
            IFPC provides a platform where students can learn, create, and showcase their creative skills.
          </p>
          <p>
            Our team covers university events, cultural programs, workshops, seminars, and special moments through
            photography and films.
          </p>
          <p>
            The goal of IFPC is to build a strong creative community and give students real experience in media
            production.
          </p>
        </div>
      </motion.section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 md:p-8">
        <SectionTitle title="Our Mission" subtitle="We shape creators through collaboration, practice, and real production experience." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {missionPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
            >
              <GlassCard>
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                    className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/30 bg-amber-300/10"
                  >
                    <MissionIcon type={point.icon} />
                  </motion.div>
                  <p className="text-slate-100">{point.title}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <SectionTitle title="What We Do" subtitle="IFPC runs practical creative work throughout the academic year." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {whatWeDo.map((item, index) => (
            <motion.article
              key={item}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-5"
            >
              <p className="text-lg font-semibold text-white">{item}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-6 md:p-8">
        <SectionTitle title="Our Team" subtitle="Defined roles keep the community organized, creative, and impactful." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {teamRoles.map((role, index) => (
            <motion.article
              key={role.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.07 }}
              className={`rounded-2xl border border-white/15 bg-gradient-to-br ${role.accent} p-5 text-center`}
            >
              <p className="text-sm uppercase tracking-wide text-slate-100">Role</p>
              <h3 className="mt-2 text-xl font-black text-white">{role.name}</h3>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <SectionTitle title="Why This Website" />
        <div className="space-y-4 text-slate-200">
          <p>This website is created to showcase IFPC events for students and clients.</p>
          <p>Only approved members can login and chat with team.</p>
          <p>Public users can see events without login.</p>
          <p>President and Admin manage members and events.</p>
        </div>
      </section>

      <footer className="mt-8 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/95 to-slate-950/95 px-6 py-6 text-center">
        <p className="text-xl font-black text-white">IFPC</p>
        <p className="mt-1 text-slate-300">MediCaps University Indore</p>
        <p className="text-slate-400">Photography Community</p>
        <p className="mt-3 text-sm text-slate-500">&copy; 2026 IFPC</p>
      </footer>
    </PageWrapper>
  )
}

export default About
