import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import API from '../api/axios'
import AdvancedHeroSlider from '../components/AdvancedHeroSlider'
import InteractiveMarquee from '../components/InteractiveMarquee'
import PageWrapper from '../components/PageWrapper'
import SkeletonImage from '../components/SkeletonImage'
import dummyEvents from '../utils/dummyEvents'
import { IFPC_ABOUT_HERO_IMAGE_URL } from '../utils/branding'

const faculty = [
	{ name: 'Aarav Verma', role: 'Direction & Visual Storytelling' },
	{ name: 'Meera Shah', role: 'Color & Post Production' },
	{ name: 'Kabir Khan', role: 'Lens, Focus, and Motion' },
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

function isProjectGalleryImage(src) {
	if (typeof src !== 'string') return false
	const normalized = src.toLowerCase()
	const cleanPath = normalized.split('?')[0]

	if (/\.(jpg|jpeg|png|webp|gif|avif)$/.test(cleanPath)) return true
	if (normalized.includes('/events/gallery/')) return true
	if (normalized.includes('/uploads/')) return true
	if (normalized.includes('/highlights/')) return true
	return false
}

function Home() {
	const [events, setEvents] = useState(dummyEvents)
	const [loadingEvents, setLoadingEvents] = useState(false)
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
				if (fetchedEvents.length > 0) {
					setEvents(fetchedEvents)
				}
			} catch {
				// Keep already rendered fallback events for faster UX.
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
			.flatMap((event) => {
				if (Array.isArray(event?.images) && event.images.length > 0) return event.images
				return event?.thumbnail ? [event.thumbnail] : []
			})
			.filter((image) => isProjectGalleryImage(image))
			.map((image) => resolveImageSrc(image))
			.filter(Boolean)

		return fromEvents.slice(0, 6)
	}, [events])

	return (
		<PageWrapper>
			<div className="-mt-20 md:-mt-24">
				<AdvancedHeroSlider />
			</div>
			<InteractiveMarquee variant="ifpc" fullScreen />

			<section
				id="about"
				data-scroll-reveal
				className="relative min-h-screen w-full overflow-hidden px-6 py-20 sm:px-10 lg:px-14"
				style={{
					backgroundImage: `linear-gradient(160deg, rgba(5,9,16,0.92), rgba(10,18,34,0.82) 50%, rgba(17,27,48,0.92)), url('${IFPC_ABOUT_HERO_IMAGE_URL}')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div className="flex min-h-[calc(100vh-10rem)] w-full items-center">
					<div data-scroll-content className="grid w-full items-center gap-10 lg:grid-cols-2">
						<div className="max-w-2xl">
							<h2 className="text-4xl font-black text-white sm:text-5xl">About IFPC</h2>
							<p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">
								IFPC is a modern creative studio focused on photography, film production, and visual storytelling. We blend camera aesthetics, post-production craft, and portfolio-driven training to create cinematic content.
							</p>
						</div>
						<div className="relative overflow-hidden rounded-3xl border border-emerald-300/25 bg-slate-900/40 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
							<SkeletonImage
								src={IFPC_ABOUT_HERO_IMAGE_URL}
								alt="IFPC group photo"
								className="h-[280px] w-full rounded-2xl object-cover sm:h-[340px]"
							/>
						</div>
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
						<div className="grid gap-5 md:grid-cols-3">
							{projectCards.map((event, index) => (
								<motion.article
									key={event._id || index}
									whileHover={{ y: -6 }}
									className="group cursor-zoom-in overflow-hidden rounded-2xl border border-green-300/25 bg-[linear-gradient(170deg,rgba(7,13,25,0.85),rgba(11,17,33,0.66))] shadow-[0_16px_42px_rgba(0,0,0,0.42)] transition-all duration-500 hover:rounded-[56px]"
								>
									<div className="relative h-64 w-full overflow-hidden">
										<SkeletonImage
											src={resolveImageSrc(event.thumbnail) || '/images/ifpc-icon.png'}
											alt={event.title || 'IFPC Project'}
											fallbackSrc="/images/ifpc-icon.png"
											referrerPolicy="no-referrer"
											className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
										/>
										<div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
											<Link
												to={`/events/${event._id}`}
												className="rounded-full border-2 border-white px-6 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white"
											>
												View Project
											</Link>
										</div>
									</div>
									<div className="space-y-3 p-5">
										<h3 className="line-clamp-1 text-lg font-semibold text-slate-100">{event.title || 'Untitled Project'}</h3>
										<p className="line-clamp-2 text-sm text-slate-300">{event.description || 'Creative visual production showcase.'}</p>
										<Link
											to={`/events/${event._id}`}
											className="inline-flex w-fit rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-4 py-2 text-sm font-semibold text-white"
										>
											View Project
										</Link>
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

					{galleryImages.length === 0 ? (
						<div className="grid min-h-[calc(100vh-11rem)] place-items-center border-y border-emerald-300/10 bg-black/40 px-6 text-center">
							<p className="text-sm text-slate-300">No project photos available yet.</p>
						</div>
					) : (
						<div className="grid min-h-[calc(100vh-11rem)] grid-cols-2 gap-0 lg:grid-cols-3">
							{galleryImages.map((image, index) => (
								<motion.button
									key={`${image}-${index}`}
									type="button"
									whileHover={{ scale: 1.01 }}
									onClick={() => setPreviewImage(image)}
									className="group relative h-full min-h-[28vh] overflow-hidden border border-emerald-300/10 text-left"
								>
									<SkeletonImage
										src={image}
										alt={`Gallery ${index + 1}`}
										fallbackSrc="/images/ifpc-icon.png"
										referrerPolicy="no-referrer"
										className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
									<p className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/90">Shot {index + 1}</p>
								</motion.button>
							))}
						</div>
					)}
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

			<section id="contact" data-scroll-reveal className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_10%_18%,rgba(16,185,129,0.14),transparent_35%),radial-gradient(circle_at_88%_12%,rgba(34,211,238,0.12),transparent_34%),linear-gradient(160deg,#04070f,#0a1221_50%,#121c33)] px-6 py-20 sm:px-10 lg:px-14">
				<div className="pointer-events-none absolute -left-20 top-28 h-56 w-56 rounded-full bg-emerald-400/12 blur-3xl" />
				<div className="pointer-events-none absolute -right-16 bottom-24 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />
				<div data-scroll-content className="relative flex min-h-[calc(100vh-10rem)] w-full items-center justify-center">
					<div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:36px_36px]" />
					<div className="relative w-full max-w-5xl rounded-3xl border border-emerald-300/30 bg-[linear-gradient(150deg,rgba(4,10,21,0.95),rgba(9,18,34,0.88))] p-6 shadow-[0_24px_65px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
						<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
						<div className="grid items-center gap-6 lg:grid-cols-[1.25fr_0.75fr]">
							<div>
								<p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/90">Contact IFPC</p>
								<h2 className="mt-3 text-4xl font-black text-white sm:text-5xl">Get In Touch</h2>
								<p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
									Connect with IFPC for event coverage, creative collaboration, and official media coordination.
								</p>
								<div className="mt-7 flex flex-wrap gap-3">
									<Link to="/contact" className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 px-5 py-3 font-semibold text-white shadow-[0_14px_36px_rgba(16,185,129,0.35)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(16,185,129,0.42)]">Contact Us</Link>
									<Link to="/about" className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-slate-100 transition duration-300 hover:-translate-y-0.5 hover:bg-white/20">Learn More</Link>
								</div>
							</div>

							<div className="rounded-2xl border border-emerald-300/30 bg-[linear-gradient(165deg,rgba(7,13,28,0.75),rgba(9,18,34,0.85))] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.35)]">
								<div className="flex items-center gap-3">
									<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/35 bg-emerald-300/10 text-emerald-200">
										<svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
											<path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm9.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
										</svg>
									</span>
									<p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200/90">Instagram</p>
								</div>
								<p className="mt-2 text-2xl font-black text-white">@ifp_community_</p>
								<p className="mt-2 text-sm text-slate-300">Follow our official account for event highlights, updates, and announcements.</p>
								<a
									href="https://www.instagram.com/ifp_community_/"
									target="_blank"
									rel="noreferrer"
									className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-300/45 bg-emerald-300/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition duration-300 hover:bg-emerald-300/25"
								>
									Follow on Instagram
								</a>
							</div>
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
