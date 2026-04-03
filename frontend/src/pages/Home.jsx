import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import PageWrapper from '../components/PageWrapper'
import SplitText from '../components/SplitText'

const courses = [
	{ title: 'Cinematic Composition', summary: 'Frame storytelling with lens language, depth, and emotion.' },
	{ title: 'Color Science & Grading', summary: 'Build signature looks with modern grading pipelines.' },
	{ title: 'Video Editing Workflow', summary: 'Professional timeline, cuts, transitions, and final delivery.' },
	{ title: 'Studio Lighting Design', summary: 'Master key, fill, practicals, and dynamic lighting rigs.' },
]

const faculty = [
	{ name: 'Aarav Verma', role: 'Direction & Visual Storytelling' },
	{ name: 'Meera Shah', role: 'Color & Post Production' },
	{ name: 'Kabir Khan', role: 'Lens, Focus, and Motion' },
]

const galleryFallback = [
	'https://images.unsplash.com/photo-1620693778087-2bced33a4a06?q=80&w=1332',
	'https://images.unsplash.com/photo-1665844092826-515257903c4c?q=80&w=687',
	'https://images.unsplash.com/photo-1598607993929-b48389d1de94?q=80&w=1170',
	'https://plus.unsplash.com/premium_photo-1665772800736-e655b2fec2e7?q=80&w=687&auto=format&fit=crop',
	'https://images.unsplash.com/photo-1597942080393-4cecdfbcee17?q=80&w=735',
	'https://images.unsplash.com/photo-1528788923685-864db0cbc312?q=80&w=730',
]

const apiBase = (import.meta.env.VITE_API_URL || 'https://ifpc.onrender.com/api').replace(/\/api\/?$/, '')

function resolveImageSrc(src) {
	if (!src) return ''
	if (src.startsWith('http')) return src
	if (src.startsWith('/')) return `${apiBase}${src}`
	return `${apiBase}/${src}`
}

function Home() {
	const [events, setEvents] = useState([])
	const [loadingEvents, setLoadingEvents] = useState(true)
	const [previewImage, setPreviewImage] = useState('')

	useEffect(() => {
		async function loadEvents() {
			try {
				const { data } = await API.get('/events')
				setEvents(Array.isArray(data?.data) ? data.data : [])
			} catch {
				setEvents([])
			} finally {
				setLoadingEvents(false)
			}
		}

		loadEvents()
	}, [])

	const heroImage = useMemo(() => resolveImageSrc(events[0]?.thumbnail) || galleryFallback[0], [events])

	const projectCards = useMemo(() => events.slice(0, 3), [events])

	const galleryImages = useMemo(() => {
		const fromEvents = events
			.map((event) => resolveImageSrc(event?.thumbnail))
			.filter(Boolean)
			.slice(0, 6)

		if (fromEvents.length >= 6) return fromEvents
		return [...fromEvents, ...galleryFallback].slice(0, 6)
	}, [events])

	const particles = useMemo(
		() =>
			Array.from({ length: 20 }, (_, i) => ({
				id: i,
				size: 2 + (i % 3),
				left: `${(i * 19) % 100}%`,
				top: `${(i * 31) % 100}%`,
				delay: i * 0.18,
			})),
		[]
	)

	return (
		<PageWrapper>
			<section className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-black">
				<motion.img
					src={heroImage}
					alt="IFPC studio"
					referrerPolicy="no-referrer"
					onError={(event) => {
						event.currentTarget.src = '/images/ifpc-icon.png'
					}}
					className="absolute inset-0 h-full w-full object-cover"
					initial={{ scale: 1.05 }}
					animate={{ scale: 1.14 }}
					transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
				/>
				<div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(1,4,10,0.82),rgba(4,10,20,0.58)_45%,rgba(0,2,8,0.88)),radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.24),transparent_38%),radial-gradient(circle_at_80%_30%,rgba(147,51,234,0.22),transparent_36%)]" />

				<div className="pointer-events-none absolute inset-0">
					{particles.map((particle) => (
						<motion.span
							key={particle.id}
							className="absolute rounded-full bg-cyan-300/60 shadow-[0_0_14px_rgba(56,189,248,0.8)]"
							style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
							animate={{ opacity: [0.15, 0.9, 0.15], y: [0, -10, 0] }}
							transition={{ duration: 3.2, delay: particle.delay, repeat: Infinity, ease: 'easeInOut' }}
						/>
					))}
				</div>

				<motion.div
					aria-hidden="true"
					className="pointer-events-none absolute right-[10%] top-[18%] h-52 w-52 rounded-full border border-cyan-300/40"
					animate={{ rotate: 360 }}
					transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
				>
					<div className="absolute inset-4 rounded-full border border-fuchsia-300/40" />
					<div className="absolute inset-8 rounded-full border border-white/25" />
					<motion.div
						className="absolute inset-0 rounded-full border border-cyan-200/70"
						animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.9, 0.4] }}
						transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
					/>
				</motion.div>

				<div className="relative z-10 flex min-h-screen w-full items-end px-6 pb-14 pt-24 sm:px-10 lg:items-center lg:px-14">
					<div className="max-w-4xl">
						<p className="inline-flex rounded-full border border-cyan-300/45 bg-cyan-500/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-100 backdrop-blur-xl">
							IFPC Creative Studio
						</p>
						<SplitText
							text="IFPC Creative Studio"
							tag="h1"
							delay={0.08}
							stagger={0.04}
							className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl"
						/>
						<p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
							Futuristic camera-inspired portfolio experience with lens focus visuals, neon glass layers, and cinematic storytelling.
						</p>

						<div className="mt-7 flex flex-wrap gap-3">
							<Link to="/events" className="rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(59,130,246,0.45)]">
								Explore Projects
							</Link>
							<Link to="/contact" className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl hover:bg-white/20">
								Contact Studio
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section id="about" className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(160deg,#050910,#0a1222_50%,#111b30)] px-6 py-20 sm:px-10 lg:px-14">
				<div className="flex min-h-[calc(100vh-10rem)] w-full items-center">
					<div className="max-w-4xl">
						<h2 className="text-4xl font-black text-white sm:text-5xl">About IFPC</h2>
						<p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
							IFPC is a modern creative studio focused on photography, film production, and visual storytelling. We blend camera aesthetics, post-production craft, and portfolio-driven training to create cinematic content.
						</p>
					</div>
				</div>
			</section>

			<section id="courses" className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(160deg,#070c17,#0b1326_48%,#121c35)] px-6 py-20 sm:px-10 lg:px-14">
				<div className="flex min-h-[calc(100vh-10rem)] w-full flex-col justify-center">
					<h2 className="text-4xl font-black text-white sm:text-5xl">Courses</h2>
					<div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
					{courses.map((item, index) => (
						<motion.article
							key={item.title}
							initial={{ opacity: 0, y: 12, scale: 0.98 }}
							whileInView={{ opacity: 1, y: 0, scale: 1 }}
							viewport={{ once: true, amount: 0.2 }}
							transition={{ duration: 0.4, delay: index * 0.06 }}
							whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
							className="rounded-2xl border border-cyan-300/25 bg-[linear-gradient(160deg,rgba(14,22,40,0.78),rgba(9,16,30,0.65))] p-5 shadow-[0_12px_30px_rgba(3,10,24,0.45)] backdrop-blur-xl"
						>
							<h3 className="text-lg font-bold text-cyan-100">{item.title}</h3>
							<p className="mt-2 text-sm text-slate-300">{item.summary}</p>
						</motion.article>
					))}
					</div>
				</div>
			</section>

			<section id="projects" className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(160deg,#050b14,#091225_45%,#111b32)] px-6 py-20 sm:px-10 lg:px-14">
				<div className="flex min-h-[calc(100vh-10rem)] w-full flex-col justify-center">
					<div className="mb-5 flex items-end justify-between">
						<h2 className="text-4xl font-black text-white sm:text-5xl">Projects / Portfolio</h2>
						<Link to="/events" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">View all</Link>
					</div>

					{loadingEvents ? (
						<div className="grid gap-4 md:grid-cols-3">
							{[1, 2, 3].map((item) => (
								<div key={item} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
							))}
						</div>
					) : projectCards.length === 0 ? (
						<p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-300">No projects published yet.</p>
					) : (
						<div className="grid gap-4 md:grid-cols-3">
							{projectCards.map((event, index) => (
								<motion.article
									key={event._id || index}
									whileHover={{ y: -6, scale: 1.01 }}
									className="group overflow-hidden rounded-2xl border border-fuchsia-300/25 bg-[linear-gradient(170deg,rgba(7,13,25,0.85),rgba(11,17,33,0.66))] shadow-[0_16px_42px_rgba(0,0,0,0.42)]"
								>
									<img
										src={resolveImageSrc(event.thumbnail) || '/images/ifpc-icon.png'}
										alt={event.title || 'IFPC Project'}
										referrerPolicy="no-referrer"
										onError={(imgEvent) => {
											imgEvent.currentTarget.src = '/images/ifpc-icon.png'
										}}
										className="h-44 w-full object-cover transition duration-700 group-hover:scale-110"
									/>
									<div className="space-y-2 p-4">
										<h3 className="line-clamp-1 text-lg font-semibold text-slate-100">{event.title || 'Untitled Project'}</h3>
										<p className="line-clamp-2 text-sm text-slate-300">{event.description || 'Creative visual production showcase.'}</p>
									</div>
								</motion.article>
							))}
						</div>
					)}
				</div>
			</section>

			<section id="gallery" className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-black">
				<div className="px-6 pb-4 pt-20 sm:px-10 lg:px-14">
					<h2 className="text-4xl font-black text-white sm:text-5xl">Gallery</h2>
					<p className="mt-2 text-sm text-slate-300">Edge-to-edge camera roll. Click any frame to preview.</p>
				</div>

				<div className="grid min-h-[calc(100vh-11rem)] grid-cols-2 gap-0 lg:grid-cols-3">
					{galleryImages.map((image, index) => (
						<motion.button
							key={`${image}-${index}`}
							type="button"
							whileHover={{ scale: 1.01 }}
							onClick={() => setPreviewImage(image)}
							className="group relative h-full min-h-[28vh] overflow-hidden border border-cyan-300/10 text-left"
						>
							<img
								src={image}
								alt={`Gallery ${index + 1}`}
								referrerPolicy="no-referrer"
								onError={(event) => {
									event.currentTarget.src = '/images/ifpc-icon.png'
								}}
								className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
							<p className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/90">Shot {index + 1}</p>
						</motion.button>
					))}
				</div>
			</section>

			<section id="faculty" className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(170deg,#060c19,#101a31_52%,#0b1224)] px-6 py-20 sm:px-10 lg:px-14">
				<div className="flex min-h-[calc(100vh-10rem)] w-full flex-col justify-center">
					<h2 className="text-4xl font-black text-white sm:text-5xl">Faculty</h2>
					<div className="mt-7 grid gap-4 md:grid-cols-3">
					{faculty.map((member, index) => (
						<motion.article
							key={member.name}
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.38, delay: index * 0.06 }}
							className="rounded-2xl border border-fuchsia-300/25 bg-[linear-gradient(160deg,rgba(10,15,30,0.76),rgba(12,20,38,0.62))] p-5 backdrop-blur-xl"
						>
							<h3 className="text-lg font-bold text-white">{member.name}</h3>
							<p className="mt-1 text-sm text-cyan-200">{member.role}</p>
						</motion.article>
					))}
					</div>
				</div>
			</section>

			<section id="contact" className="relative left-1/2 min-h-screen w-screen -translate-x-1/2 overflow-hidden bg-[linear-gradient(160deg,#04070f,#0a1221_50%,#121c33)] px-6 py-20 sm:px-10 lg:px-14">
				<div className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center text-center">
					<div className="max-w-3xl">
						<h2 className="text-4xl font-black text-white sm:text-5xl">Contact</h2>
						<p className="mx-auto mt-4 text-base text-slate-300 sm:text-lg">Start your next camera, film, or creative portfolio collaboration with IFPC Creative Studio.</p>
						<div className="mt-7 flex flex-wrap justify-center gap-3">
							<Link to="/contact" className="rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-5 py-3 font-semibold text-white shadow-[0_14px_36px_rgba(59,130,246,0.35)]">Open Contact</Link>
							<Link to="/about" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-slate-100 hover:bg-white/20">Learn More</Link>
						</div>
					</div>
				</div>
			</section>

			<AnimatePresence>
				{previewImage ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-[12000] grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
						onClick={() => setPreviewImage('')}
					>
						<motion.img
							src={previewImage}
							alt="Preview"
							referrerPolicy="no-referrer"
							onError={(event) => {
								event.currentTarget.src = '/images/ifpc-icon.png'
							}}
							initial={{ scale: 0.92, opacity: 0, filter: 'blur(8px)' }}
							animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
							exit={{ scale: 0.97, opacity: 0 }}
							transition={{ duration: 0.28, ease: 'easeOut' }}
							className="max-h-[86vh] w-full max-w-5xl rounded-2xl border border-cyan-300/35 object-cover shadow-[0_18px_50px_rgba(0,0,0,0.56)]"
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
		</PageWrapper>
	)
}

export default Home
