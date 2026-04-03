import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { IFPC_LOGO_URL } from '../utils/branding'

const missionPoints = [
  {
    title: 'Promote photography and filmmaking culture',
    detail: 'We build a creative ecosystem where visual storytelling is practiced with intent.',
    icon: 'camera',
  },
  {
    title: 'Mentor students with practical workflows',
    detail: 'Learning happens through projects, feedback cycles, and real production constraints.',
    icon: 'spark',
  },
  {
    title: 'Document university life and flagship events',
    detail: 'From cultural fests to workshops, we preserve campus memories with consistency.',
    icon: 'event',
  },
  {
    title: 'Deliver media support for academic and brand needs',
    detail: 'Teams collaborate with departments for photo, video, and communication requirements.',
    icon: 'support',
  },
  {
    title: 'Develop a disciplined and collaborative team',
    detail: 'Members grow with role clarity, ownership, and professional creative standards.',
    icon: 'team',
  },
]

const whatWeDo = [
  { name: 'Event Photography', desc: 'High-quality event coverage with editorial consistency.' },
  { name: 'Videography', desc: 'Dynamic video capture for ceremonies, sessions, and highlights.' },
  { name: 'Film Making', desc: 'Concept-to-screen workflow for short-form campus storytelling.' },
  { name: 'Editing', desc: 'Professional post-production in pacing, color, and sound.' },
  { name: 'Workshops', desc: 'Peer learning and mentor-led sessions on tools and craft.' },
  { name: 'Content Creation', desc: 'Brand-ready visual assets for digital and campus channels.' },
]

const teamRoles = [
  { name: 'President', note: 'Leads vision, quality standards, and team direction.' },
  { name: 'Vice President', note: 'Coordinates execution, planning, and cross-team alignment.' },
  { name: 'Heads', note: 'Manage department-level tasks and production milestones.' },
  { name: 'Core Members', note: 'Drive key projects and mentor growing team members.' },
  { name: 'Members', note: 'Contribute in active shoots, edits, and event operations.' },
]

const quickStats = [
  { label: 'Instagram Followers', value: '2,200+' },
  { label: 'Creative Tracks', value: '6' },
  { label: 'Campus Presence', value: 'MediCaps' },
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
  const common = 'h-5 w-5 text-emerald-200'

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
          style={{ backgroundImage: `url('${IFPC_LOGO_URL}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/75 via-slate-900/70 to-emerald-950/75" />
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
          <p className="mt-4 max-w-3xl text-base text-slate-200 md:text-lg">
            Official photography and filmmaking community of MediCaps University. IFPC nurtures student creators through
            practical production work, collaborative learning, and campus storytelling.
          </p>
          <p className="mt-2 text-emerald-300">Capturing Moments, Creating Memories</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {quickStats.map((item) => (
              <div key={item.label} className="rounded-xl border border-emerald-200/20 bg-black/25 p-4 backdrop-blur">
                <p className="text-2xl font-black text-emerald-200">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
      >
        <SectionTitle title="About IFPC" subtitle="A student-first creative community built on hands-on execution." />
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4 text-slate-200">
            <p>
              Ikshana Film and Photography Community (IFPC) is the official visual media community of MediCaps
              University Indore.
            </p>
            <p>
              We provide a growth platform for students passionate about photography, videography, editing, and film
              production through practical assignments and team projects.
            </p>
            <p>
              Our work spans university events, cultural programs, seminars, workshops, and digital content support for
              campus communication.
            </p>
          </div>

          <GlassCard className="border-emerald-200/20 bg-emerald-300/[0.06]">
            <p className="text-sm uppercase tracking-[0.16em] text-emerald-200">Vision</p>
            <p className="mt-3 text-slate-100">
              Build a disciplined creative team that blends storytelling, technical skill, and professional workflow.
            </p>
            <p className="mt-4 text-sm text-slate-300">Outcome: students graduate with portfolio-ready project experience.</p>
          </GlassCard>
        </div>
      </motion.section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-6 md:p-8">
        <SectionTitle
          title="Our Mission"
          subtitle="We shape creators through collaboration, practical training, and real production ownership."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {missionPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.08 }}
            >
              <GlassCard className="h-full">
                <div className="flex items-start gap-3">
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 }}
                    className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/30 bg-emerald-300/10"
                  >
                    <MissionIcon type={point.icon} />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-slate-100">{point.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{point.detail}</p>
                  </div>
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
              key={item.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-5"
            >
              <p className="text-lg font-semibold text-white">{item.name}</p>
              <p className="mt-2 text-sm text-slate-300">{item.desc}</p>
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
              className="rounded-2xl border border-white/15 bg-gradient-to-br from-emerald-400/25 to-emerald-600/10 p-5 text-center"
            >
              <p className="text-sm uppercase tracking-wide text-slate-100">Role</p>
              <h3 className="mt-2 text-xl font-black text-white">{role.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{role.note}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
        <SectionTitle title="Why This Website" subtitle="Purpose-built for visibility, collaboration, and efficient community operations." />
        <div className="grid gap-4 md:grid-cols-2">
          <GlassCard className="bg-white/6">
            <p className="text-sm uppercase tracking-[0.15em] text-emerald-200">Public Experience</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-200 marker:text-emerald-300">
              <li>Showcases IFPC projects and event highlights.</li>
              <li>Helps students and visitors explore creative output.</li>
            </ul>
          </GlassCard>

          <GlassCard className="bg-white/6">
            <p className="text-sm uppercase tracking-[0.15em] text-emerald-200">Team Workspace</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-200 marker:text-emerald-300">
              <li>Approved members can log in and coordinate internally.</li>
              <li>Admin and President can manage members and event records.</li>
            </ul>
          </GlassCard>
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
