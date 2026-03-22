import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'

const courses = [
  {
    title: 'Photography Fundamentals',
    level: 'Beginner',
    summary: 'Master framing, exposure, composition, and practical camera handling.',
  },
  {
    title: 'Cinematic Videography',
    level: 'Intermediate',
    summary: 'Learn camera movement, shot language, and storytelling with visual rhythm.',
  },
  {
    title: 'Film Editing Workflow',
    level: 'Intermediate',
    summary: 'Build polished edits with pacing, transitions, color correction, and sound sync.',
  },
  {
    title: 'Advanced Color Grading',
    level: 'Advanced',
    summary: 'Create signature cinematic looks with contrast control and color harmony.',
  },
  {
    title: 'Lighting for Portrait & Studio',
    level: 'Intermediate',
    summary: 'Design professional lighting setups for portraits, events, and creative sets.',
  },
  {
    title: 'Portfolio Production Lab',
    level: 'Project-based',
    summary: 'Collaborative production sprints to build college and client-ready portfolios.',
  },
]

function Courses() {
  return (
    <PageWrapper>
      <section className="w-full px-4 py-8 sm:px-6 lg:px-10">
        <div className="rounded-3xl border border-cyan-300/20 bg-[linear-gradient(160deg,rgba(6,12,24,0.85),rgba(12,22,42,0.75))] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:p-8">
          <h1 className="text-3xl font-black text-white sm:text-4xl">Courses</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            IFPC courses are designed for practical camera, film, and post-production excellence with a modern portfolio-focused approach.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course, index) => (
              <motion.article
                key={course.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="rounded-2xl border border-fuchsia-300/25 bg-[linear-gradient(160deg,rgba(10,18,34,0.78),rgba(7,14,27,0.68))] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200">{course.level}</p>
                <h2 className="mt-2 text-xl font-bold text-white">{course.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{course.summary}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

export default Courses
