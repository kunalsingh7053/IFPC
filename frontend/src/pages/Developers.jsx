import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import InteractiveMarquee from '../components/InteractiveMarquee'

const developers = [
  {
    name: 'Kunal Singh Patel',
    role: 'Project Architect • Full Stack Developer',
    bio: 'Project architect of this platform. Designed and built both frontend and backend using React, Node.js, Express.js, and MongoDB with a focus on clean architecture and performance.',
    image: 'https://ik.imagekit.io/ofm1vl6gr/Developers/kunalsinghpatelprofile',
    expertise: ['System Architecture', 'Frontend Engineering', 'Backend Development'],
    profileContactUrl: `https://wa.me/918823047856?text=${encodeURIComponent('hii')}`,
  },
  {
    name: 'Prajwal Tanwar',
    role: 'Creative Developer',
    bio: 'Designs premium visual systems, cinematic UI details, and interactive experiences that feel alive.',
    expertise: ['Creative Direction', 'UI Motion', 'Visual Storytelling'],
  },
]

const skills = ['React', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'Backend Architecture', 'UI/UX', 'Animation', 'AI Integration']

const floatingOrbs = [
  { id: 1, className: 'left-[8%] top-[16%] h-32 w-32 bg-emerald-500/30 blur-3xl', duration: 9 },
  { id: 2, className: 'right-[10%] top-[12%] h-44 w-44 bg-green-500/28 blur-3xl', duration: 11 },
  { id: 3, className: 'left-[20%] bottom-[18%] h-36 w-36 bg-teal-500/25 blur-3xl', duration: 10 },
  { id: 4, className: 'right-[16%] bottom-[14%] h-40 w-40 bg-lime-400/24 blur-3xl', duration: 12 },
]

const whatsappUrl = `https://wa.me/918823047856?text=${encodeURIComponent('hii')}`

function Developers() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.35 })
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.35 })
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10])
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-14, 14])
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-10, 10])

  function handleParallaxMove(event) {
    const rect = event.currentTarget.getBoundingClientRect()
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5

    mouseX.set(normalizedX)
    mouseY.set(normalizedY)
  }

  function handleParallaxLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <PageWrapper>
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.2),transparent_35%),radial-gradient(circle_at_80%_5%,rgba(34,197,94,0.2),transparent_35%),linear-gradient(175deg,#040a10,#06131f_48%,#0e1f22)] text-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:46px_46px]" />

        {floatingOrbs.map((orb) => (
          <motion.div
            key={orb.id}
            aria-hidden="true"
            className={`pointer-events-none absolute rounded-full ${orb.className}`}
            animate={{ y: [0, -14, 0], x: [0, 10, 0], opacity: [0.45, 0.8, 0.45] }}
            transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

        <section className="relative flex min-h-[100svh] items-center px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-6"
            >
              <p className="inline-flex rounded-full border border-emerald-300/40 bg-emerald-500/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
                Developer Studio
              </p>
              <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
                Meet the Developers
              </h1>
              <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
                Crafting digital experiences with creativity and code.
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                We combine hard work, design precision, and engineering discipline to build powerful websites that feel cinematic, fast, and memorable.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(16,185,129,0.35)] transition-transform hover:scale-[1.03]"
                >
                  Contact / Hire Us
                </a>
                <a
                  href="#developers-showcase"
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-white/15"
                >
                  Explore Profile
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 22 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut', delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-r from-emerald-500/35 via-green-400/25 to-teal-500/30 blur-2xl" />
              <motion.div
                onMouseMove={handleParallaxMove}
                onMouseLeave={handleParallaxLeave}
                style={{ rotateX, rotateY, x: translateX, y: translateY, transformPerspective: 1200 }}
                className="relative rounded-[28px] border border-white/20 bg-white/10 p-3 shadow-[0_28px_70px_rgba(10,10,35,0.55)] backdrop-blur-2xl"
              >
                <div className="overflow-hidden rounded-[22px] border border-white/15">
                  <img
                    src="https://ik.imagekit.io/ofm1vl6gr/Developers/WhatsApp%20Image%202026-04-03%20at%202.53.17%20PM.jpeg"
                    alt="Developers group"
                    className="h-full w-full object-cover transition duration-700 hover:scale-110"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.16),transparent_55%)]" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <InteractiveMarquee variant="developer" />

        <section id="developers-showcase" className="relative px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55 }}
              className="text-3xl font-black text-white sm:text-5xl"
            >
              Developers Showcase
            </motion.h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {developers.map((dev, index) => (
                <motion.a
                  key={dev.name}
                  href={dev.profileContactUrl || undefined}
                  target={dev.profileContactUrl ? '_blank' : undefined}
                  rel={dev.profileContactUrl ? 'noreferrer' : undefined}
                  aria-label={dev.profileContactUrl ? `Send message to ${dev.name}` : undefined}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.55, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className={`group relative overflow-hidden rounded-3xl border border-white/15 bg-[linear-gradient(160deg,rgba(11,18,34,0.84),rgba(10,28,30,0.78))] p-6 shadow-[0_18px_48px_rgba(4,8,22,0.52)] backdrop-blur-xl ${dev.profileContactUrl ? 'cursor-pointer transition hover:border-emerald-300/40' : ''}`}
                >
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/45 to-transparent" />
                  <div className="relative flex items-start gap-4">
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-slate-900/70 shadow-[0_12px_24px_rgba(0,0,0,0.35)]">
                      {dev.image ? (
                        <img
                          src={dev.image}
                          alt={dev.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(event) => {
                            event.currentTarget.src = '/images/ifpc-icon.png'
                          }}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-3xl font-black text-slate-200">
                          {dev.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold text-white sm:text-2xl">{dev.name}</h3>
                      <p className="mt-1 text-sm font-medium text-emerald-200">{dev.role}</p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{dev.bio}</p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {dev.expertise.map((item) => (
                          <span
                            key={`${dev.name}-${item}`}
                            className="rounded-full border border-emerald-300/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-100"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        <section className="relative px-6 py-20 sm:px-10 lg:px-16">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_18px_56px_rgba(7,10,25,0.45)] backdrop-blur-2xl"
            >
              <h2 className="text-3xl font-black text-white sm:text-4xl">About Our Teamwork</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                We are a focused duo driven by hard work, consistency, and craft. This project is spearheaded by Kunal Singh Patel as the project architect, with strong planning, clean implementation, and bold visual execution.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
                Both frontend and backend were built by Kunal Singh Patel to deliver a complete full-stack experience that is scalable, expressive, and genuinely enjoyable to use.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="rounded-3xl border border-white/15 bg-[linear-gradient(150deg,rgba(7,12,30,0.78),rgba(21,16,40,0.62))] p-6 shadow-[0_18px_56px_rgba(7,10,25,0.45)] backdrop-blur-xl"
            >
              <h3 className="text-xl font-bold text-white">Skills & Stack</h3>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.88 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.35, delay: 0.05 * index }}
                    whileHover={{ y: -2, scale: 1.04 }}
                    className="rounded-full border border-blue-300/35 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-blue-100"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative px-6 pb-24 pt-6 sm:px-10 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6 }}
            className="mx-auto w-full max-w-7xl rounded-[32px] border border-white/15 bg-[linear-gradient(140deg,rgba(16,185,129,0.22),rgba(34,197,94,0.24))] p-8 text-center shadow-[0_25px_90px_rgba(12,18,44,0.45)] backdrop-blur-2xl sm:p-12"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100/90">Ready To Collaborate</p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-5xl">Let&apos;s Build Something Amazing Together</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
              If you want a modern, premium, and performance-focused web experience, we are ready to craft it with you.
            </p>
            <div className="mt-7">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_42px_rgba(16,185,129,0.45)] transition-transform hover:scale-[1.03]"
              >
                Contact / Hire Us
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </PageWrapper>
  )
}

export default Developers
