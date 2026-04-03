import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import API from '../api/axios'
import AdvancedHeroSlider from '../components/AdvancedHeroSlider'
import InteractiveMarquee from '../components/InteractiveMarquee'
import PageWrapper from '../components/PageWrapper'
import dummyEvents from '../utils/dummyEvents'

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

const impactStats = [
	{ label: 'Years of Experience', value: 12, suffix: '+' },
	{ label: 'Events Covered', value: 380, suffix: '+' },
	{ label: 'Alumni', value: 940, suffix: '+' },
	{ label: 'Instagram Followers', value: 2200, suffix: '+' },
	{ label: 'Current Team Size', value: 42, suffix: '' },
]

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
	const [hasStartedCounters, setHasStartedCounters] = useState(false)
	const [counterValues, setCounterValues] = useState(() => impactStats.map(() => 0))
	const countersSectionRef = useRef(null)
	const counterTweenRefs = useRef([])
	const counterSourcesRef = useRef(impactStats.map(() => ({ value: 0 })))

	useEffect(() => {
		async function loadEvents() {
			try {
				const { data } = await API.get('/events')
				const fetchedEvents = Array.isArray(data?.data) ? data.data : []
				setEvents(fetchedEvents.length > 0 ? fetchedEvents : dummyEvents)
			} catch {
				setEvents(dummyEvents)
			} finally {
				setLoadingEvents(false)
			}
		}

		loadEvents()
	}, [])

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)

		const context = gsap.context(() => {
			const sections = gsap.utils.toArray('[data-scroll-reveal]')

			sections.forEach((section) => {
				const target = section.querySelector('[data-scroll-content]') || section

				gsap.fromTo(
					target,
					{ autoAlpha: 0, y: 56 },
					{
						autoAlpha: 1,
						y: 0,
						duration: 1.1,
						ease: 'power3.out',
						scrollTrigger: {
							trigger: section,
							start: 'top bottom',
							end: 'top top',
							scrub: 0.9,
						},
					}
				)
			})
		})

		return () => {
			context.revert()
		}
	}, [])

	useEffect(() => {
		const target = countersSectionRef.current
		if (!target || hasStartedCounters) return undefined

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setHasStartedCounters(true)
					observer.disconnect()
				}
			},
			{ threshold: 0.25 }
		)

		observer.observe(target)

		return () => {
			observer.disconnect()
		}
	}, [hasStartedCounters])

	useEffect(() => {
		if (!hasStartedCounters) return undefined

		setCounterValues(impactStats.map(() => 0))
		counterTweenRefs.current.forEach((tween) => tween?.kill())
		counterTweenRefs.current = []

		counterSourcesRef.current = impactStats.map(() => ({ value: 0 }))

		impactStats.forEach((stat, index) => {
			const tween = gsap.to(counterSourcesRef.current[index], {
				value: stat.value,
				duration: 2 + index * 0.18,
				ease: 'expo.out',
				onUpdate: () => {
					setCounterValues((prev) => {
						const next = [...prev]
						next[index] = Math.floor(counterSourcesRef.current[index].value)
						return next
					})
				},
				onComplete: () => {
					setCounterValues((prev) => {
						const next = [...prev]
						next[index] = stat.value
						return next
					})
				},
			})

			counterTweenRefs.current.push(tween)
		})

		return () => {
			counterTweenRefs.current.forEach((tween) => tween?.kill())
			counterTweenRefs.current = []
		}
	}, [hasStartedCounters])

	const formatCounterNumber = (value) => new Intl.NumberFormat('en-IN').format(value)

	const projectCards = useMemo(() => events.slice(0, 3), [events])

	const galleryImages = useMemo(() => {
		const fromEvents = events
			.map((event) => resolveImageSrc(event?.thumbnail))
			.filter(Boolean)
			.slice(0, 6)

		if (fromEvents.length >= 6) return fromEvents
		return [...fromEvents, ...galleryFallback].slice(0, 6)
	}, [events])

	return (
		<PageWrapper>
			<div className="-mt-20 md:-mt-24">
				<AdvancedHeroSlider />
			</div>
			<InteractiveMarquee variant="ifpc" fullScreen />

			<section id="about" data-scroll-reveal className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(160deg,#050910,#0a1222_50%,#111b30)] px-6 py-20 sm:px-10 lg:px-14">
				<div className="flex min-h-[calc(100vh-10rem)] w-full items-center">
					<div data-scroll-content className="max-w-4xl">
						<h2 className="text-4xl font-black text-white sm:text-5xl">About IFPC</h2>
						<p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
							IFPC is a modern creative studio focused on photography, film production, and visual storytelling. We blend camera aesthetics, post-production craft, and portfolio-driven training to create cinematic content.
						</p>
					</div>
				</div>
			</section>

			<section
				id="impact"
				ref={countersSectionRef}
				data-scroll-reveal
				className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(155deg,#02060e,#071324_48%,#10213d)] px-6 py-20 sm:px-10 lg:px-14"
			>
				<div data-scroll-content className="flex min-h-[calc(100vh-10rem)] w-full flex-col justify-center">
					<div className="max-w-3xl">
						<p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300/90">IFPC Impact</p>
						<h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">Our Journey In Numbers</h2>
						<p className="mt-4 text-base text-slate-300 sm:text-lg">
							When this section appears on screen, each metric counts from 0 to its real value so visitors can instantly feel our growth.
						</p>
					</div>

					<div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
						{impactStats.map((stat, index) => (
							<motion.article
								key={stat.label}
								initial={{ opacity: 0, y: 16 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, amount: 0.25 }}
								transition={{ duration: 0.45, delay: index * 0.07 }}
								animate={hasStartedCounters ? { boxShadow: ['0 18px 44px rgba(0,0,0,0.35)', '0 22px 52px rgba(16,185,129,0.20)', '0 18px 44px rgba(0,0,0,0.35)'] } : {}}
								style={{ willChange: 'transform' }}
								className="rounded-2xl border border-emerald-300/30 bg-[linear-gradient(160deg,rgba(7,13,28,0.8),rgba(8,18,34,0.62))] p-5 shadow-[0_18px_44px_rgba(0,0,0,0.35)] backdrop-blur-xl"
							>
								<p className="text-4xl font-black text-emerald-200 sm:text-5xl">
									{formatCounterNumber(counterValues[index])}
									{stat.suffix}
								</p>
								<p className="mt-2 text-sm font-medium text-slate-300">{stat.label}</p>
							</motion.article>
						))}
					</div>
				</div>
			</section>

			<section id="courses" data-scroll-reveal className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(160deg,#070c17,#0b1326_48%,#121c35)] px-6 py-20 sm:px-10 lg:px-14">
				<div data-scroll-content className="flex min-h-[calc(100vh-10rem)] w-full flex-col justify-center">
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
							className="rounded-2xl border border-emerald-300/25 bg-[linear-gradient(160deg,rgba(14,22,40,0.78),rgba(9,16,30,0.65))] p-5 shadow-[0_12px_30px_rgba(3,10,24,0.45)] backdrop-blur-xl"
						>
							<h3 className="text-lg font-bold text-emerald-100">{item.title}</h3>
							<p className="mt-2 text-sm text-slate-300">{item.summary}</p>
						</motion.article>
					))}
					</div>
				</div>
			</section>

			<section id="projects" data-scroll-reveal className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(160deg,#050b14,#091225_45%,#111b32)] px-6 py-20 sm:px-10 lg:px-14">
				<div data-scroll-content className="flex min-h-[calc(100vh-10rem)] w-full flex-col justify-center">
					<div className="mb-5 flex items-end justify-between">
						<h2 className="text-4xl font-black text-white sm:text-5xl">Projects / Portfolio</h2>
						<Link to="/events" className="text-sm font-semibold text-emerald-300 hover:text-emerald-200">View all</Link>
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
									whileHover={{ y: -6 }}
									className="group overflow-hidden rounded-2xl border border-green-300/25 bg-[linear-gradient(170deg,rgba(7,13,25,0.85),rgba(11,17,33,0.66))] shadow-[0_16px_42px_rgba(0,0,0,0.42)] transition-all duration-500 hover:rounded-[56px]"
								>
									<div className="relative h-44 w-full overflow-hidden">
										<img
											src={resolveImageSrc(event.thumbnail) || '/images/ifpc-icon.png'}
											alt={event.title || 'IFPC Project'}
											referrerPolicy="no-referrer"
											onError={(imgEvent) => {
												imgEvent.currentTarget.src = '/images/ifpc-icon.png'
											}}
											className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
										/>
										<div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
											<span className="rounded-full border-2 border-white px-6 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white">
												Voir le projet
											</span>
										</div>
									</div>
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

			<section id="gallery" data-scroll-reveal className="relative min-h-screen w-full overflow-hidden bg-black">
				<div data-scroll-content>
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
								className="group relative h-full min-h-[28vh] overflow-hidden border border-emerald-300/10 text-left"
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
				</div>
			</section>

			<section id="team" data-scroll-reveal className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(170deg,#060c19,#101a31_52%,#0b1224)] px-6 py-20 sm:px-10 lg:px-14">
				<div data-scroll-content className="flex min-h-[calc(100vh-10rem)] w-full flex-col justify-center">
					<h2 className="text-4xl font-black text-white sm:text-5xl">Team</h2>
					<div className="mt-7 grid gap-4 md:grid-cols-3">
					{faculty.map((member, index) => (
						<motion.article
							key={member.name}
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.38, delay: index * 0.06 }}
							className="rounded-2xl border border-green-300/25 bg-[linear-gradient(160deg,rgba(10,15,30,0.76),rgba(12,20,38,0.62))] p-5 backdrop-blur-xl"
						>
							<h3 className="text-lg font-bold text-white">{member.name}</h3>
							<p className="mt-1 text-sm text-emerald-200">{member.role}</p>
						</motion.article>
					))}
					</div>
				</div>
			</section>

			<section id="contact" data-scroll-reveal className="relative min-h-screen w-full overflow-hidden bg-[linear-gradient(160deg,#04070f,#0a1221_50%,#121c33)] px-6 py-20 sm:px-10 lg:px-14">
				<div data-scroll-content className="flex min-h-[calc(100vh-10rem)] w-full items-center justify-center text-center">
					<div className="max-w-3xl">
						<h2 className="text-4xl font-black text-white sm:text-5xl">Contact</h2>
						<p className="mx-auto mt-4 text-base text-slate-300 sm:text-lg">Start your next camera, film, or creative portfolio collaboration with IFPC Creative Studio.</p>
						<div className="mt-7 flex flex-wrap justify-center gap-3">
							<Link to="/contact" className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 font-semibold text-white shadow-[0_14px_36px_rgba(59,130,246,0.35)]">Open Contact</Link>
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
							className="max-h-[86vh] w-full max-w-5xl rounded-2xl border border-emerald-300/35 object-cover shadow-[0_18px_50px_rgba(0,0,0,0.56)]"
						/>
					</motion.div>
				) : null}
			</AnimatePresence>
		</PageWrapper>
	)
}

export default Home
