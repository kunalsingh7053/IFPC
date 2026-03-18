import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import API from '../api/axios'
import PageWrapper from '../components/PageWrapper'
import EventCard from '../components/EventCard'

const skillTracks = [
  {
    title: 'Leadership & Public Speaking',
    summary: 'Build confidence, stage presence, and communication that creates impact.',
  },
  {
    title: 'Technology & Innovation',
    summary: 'Hands-on exposure to modern tools, problem solving, and digital creativity.',
  },
  {
    title: 'Community & Social Impact',
    summary: 'Collaborate across regions and contribute to meaningful initiatives.',
  },
  {
    title: 'Career & Entrepreneurship',
    summary: 'Grow practical skills for internships, jobs, and startup journeys.',
  },
]

const timeline = [
	{ year: 'Phase 01', title: 'Learn', desc: 'Master core skills with hands-on sessions and guided projects.' },
	{ year: 'Phase 02', title: 'Build', desc: 'Create portfolio-quality work with team collaboration.' },
	{ year: 'Phase 03', title: 'Showcase', desc: 'Present projects publicly in events across regions.' },
]

const cityTags = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Kolkata', 'Chennai', 'Pune', 'Ahmedabad']

function Home() {
	const [events, setEvents] = useState([])
	const [loadingEvents, setLoadingEvents] = useState(true)

	useEffect(() => {
		async function loadFeaturedEvents() {
			try {
				const { data } = await API.get('/events')
				setEvents(Array.isArray(data?.data) ? data.data : [])
			} catch {
				setEvents([])
			} finally {
				setLoadingEvents(false)
			}
		}

		loadFeaturedEvents()
	}, [])

	const featuredEvents = useMemo(() => events.slice(0, 3), [events])

	return (
		<PageWrapper>
			<section className="relative overflow-hidden rounded-3xl border border-white/10 bg-hero p-8 md:p-12 lg:p-16">
				<motion.div
					aria-hidden="true"
					animate={{ x: [0, 28, 0], y: [0, -18, 0] }}
					transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
					className="pointer-events-none absolute -top-16 -right-10 h-48 w-48 rounded-full bg-amber-400/25 blur-3xl"
				/>
				<motion.div
					aria-hidden="true"
					animate={{ x: [0, -18, 0], y: [0, 12, 0] }}
					transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
					className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl"
				/>

				<motion.h1
					initial={{ opacity: 0, y: 14 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative z-10 max-w-5xl text-4xl font-black leading-tight text-white md:text-6xl"
				>
					Build Your Portfolio, Showcase Your Skills, Join India-Wide Events
				</motion.h1>
				<p className="relative z-10 mt-4 max-w-3xl text-slate-200 md:text-lg">
					A long-scroll interactive home experience designed for students and professionals to discover programs, track growth, and present their work publicly.
				</p>
				<div className="relative z-10 mt-7 flex flex-wrap gap-3">
					<Link to="/events" className="rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-amber-600/25">
						Explore Live Events
					</Link>
					<Link to="/register" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-slate-100">
						Create Your Profile
					</Link>
				</div>

				<div className="relative z-10 mt-8 grid gap-3 sm:grid-cols-3">
					{[
						{ label: 'Open Access', value: 'All India' },
						{ label: 'Showcase Tracks', value: '4+' },
						{ label: 'Community Type', value: 'Students + Pros' },
					].map((item) => (
						<div key={item.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
							<p className="text-xs uppercase tracking-wide text-slate-300">{item.label}</p>
							<p className="mt-1 text-lg font-semibold text-white">{item.value}</p>
						</div>
					))}
				</div>
			</section>

			<section className="mt-10 rounded-3xl border border-white/10 bg-portfolio-band p-6 md:p-8">
				<div className="flex flex-wrap gap-2">
					{cityTags.map((city) => (
						<motion.span
							key={city}
							whileHover={{ y: -3 }}
							className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100"
						>
							{city}
						</motion.span>
					))}
				</div>
			</section>

			<section className="mt-10">
				<div className="mb-4 flex items-end justify-between gap-3">
					<div>
						<h2 className="text-2xl font-bold text-white">Portfolio Skill Tracks</h2>
						<p className="mt-1 text-slate-300">Designed to help participants learn, build, and present their abilities.</p>
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-2">
					{skillTracks.map((item, index) => (
						<motion.article
							key={item.title}
							initial={{ opacity: 0, y: 14 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: index * 0.08 }}
							viewport={{ once: true, amount: 0.2 }}
							whileHover={{ y: -6 }}
							className="rounded-2xl border border-white/10 bg-white/5 p-5"
						>
							<h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
							<p className="mt-2 text-sm text-slate-300">{item.summary}</p>
						</motion.article>
					))}
				</div>
			</section>

			<section className="mt-12">
				<div className="mb-4">
					<h2 className="text-2xl font-bold text-white">Growth Journey</h2>
					<p className="mt-1 text-slate-300">A portfolio-style path from learning to public showcase.</p>
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					{timeline.map((step, idx) => (
						<motion.article
							key={step.title}
							initial={{ opacity: 0, y: 16 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.35, delay: idx * 0.1 }}
							viewport={{ once: true }}
							className="rounded-2xl border border-white/10 bg-white/5 p-5"
						>
							<p className="text-xs uppercase tracking-wide text-amber-300">{step.year}</p>
							<h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
							<p className="mt-2 text-sm text-slate-300">{step.desc}</p>
						</motion.article>
					))}
				</div>
			</section>

			<section className="mt-10">
				<div className="mb-4 flex items-end justify-between gap-3">
					<div>
						<h2 className="text-2xl font-bold text-white">Featured Events</h2>
						<p className="mt-1 text-slate-300">Public events with details and thumbnails. Open to explore.</p>
					</div>
					<Link to="/events" className="text-sm font-semibold text-amber-300 hover:text-amber-200">
						See All
					</Link>
				</div>

				{loadingEvents ? (
					<div className="grid gap-4 md:grid-cols-3">
						{[1, 2, 3].map((item) => (
							<div key={item} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
						))}
					</div>
				) : featuredEvents.length === 0 ? (
					<p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-300">
						No events published yet. New events will appear here automatically.
					</p>
				) : (
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{featuredEvents.map((event) => (
							<EventCard key={event._id} event={event} />
						))}
					</div>
				)}
			</section>

			<section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
				<motion.h3
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-2xl font-bold text-white"
				>
					Ready To Showcase Your Work?
				</motion.h3>
				<p className="mx-auto mt-3 max-w-2xl text-slate-300">
					Join the community, publish your growth journey, and participate in live skill-based events.
				</p>
				<div className="mt-6 flex justify-center gap-3">
					<Link to="/register" className="rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 px-5 py-3 font-semibold text-white">
						Get Started
					</Link>
					<Link to="/about" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-slate-100">
						Learn About IFPC
					</Link>
				</div>
			</section>
		</PageWrapper>
	)
}

export default Home
