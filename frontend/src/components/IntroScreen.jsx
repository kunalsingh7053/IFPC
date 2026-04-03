import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const GREETINGS = [
	{ word: 'Hello', lang: 'English' },
	{ word: 'Namaste', lang: 'Hindi' },
	{ word: 'Bonjour', lang: 'French' },
	{ word: 'Ciao', lang: 'Italian' },
	{ word: 'Salam', lang: 'Urdu' },
	{ word: 'Hola', lang: 'Spanish' },
	{ word: 'Konnichiwa', lang: 'Japanese' },
]
const GREETING_STEP_MS = 700

function IntroScreen({ onDone }) {
	const [phase, setPhase] = useState('greetings')
	const [index, setIndex] = useState(0)

	const activeGreeting = useMemo(() => GREETINGS[index] || GREETINGS[0], [index])

	useEffect(() => {
		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		if (reduceMotion) {
			setPhase('welcome')
			const reducedTimeout = window.setTimeout(() => {
				onDone?.()
			}, 900)
			return () => window.clearTimeout(reducedTimeout)
		}

		const timers = []

		const playGreeting = (nextIndex) => {
			setIndex(nextIndex)

			if (nextIndex >= GREETINGS.length - 1) {
				timers.push(
					window.setTimeout(() => {
						setPhase('welcome')
						timers.push(
							window.setTimeout(() => {
								onDone?.()
							}, 1300)
						)
					}, GREETING_STEP_MS)
				)
				return
			}

			timers.push(window.setTimeout(() => playGreeting(nextIndex + 1), GREETING_STEP_MS))
		}

		playGreeting(0)

		return () => {
			timers.forEach((timer) => window.clearTimeout(timer))
		}
	}, [onDone])

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
			className="fixed inset-0 z-[12000] grid place-items-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(245,158,11,0.15),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(34,211,238,0.16),transparent_34%),linear-gradient(160deg,#02050c_0%,#070f1b_45%,#0e1a2d_100%)]"
		>
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute -left-14 top-10 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl"
				animate={{ x: [0, 14, 0], y: [0, -16, 0] }}
				transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
			/>
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute -right-16 bottom-8 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl"
				animate={{ x: [0, -16, 0], y: [0, 14, 0] }}
				transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
			/>

			<div className="relative z-10 mx-auto w-[min(90vw,760px)] px-4 text-center">
				<AnimatePresence mode="wait">
					{phase === 'greetings' && (
						<motion.div
							key={`greet-${activeGreeting.word}`}
							initial={{ opacity: 0, y: 10, scale: 0.97, filter: 'blur(6px)' }}
							animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
							exit={{ opacity: 0, y: -8, scale: 1.02, filter: 'blur(6px)' }}
							transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
							className="transform-gpu space-y-2 will-change-transform"
						>
							<p className="text-4xl font-semibold tracking-wide text-slate-100 sm:text-5xl">{activeGreeting.word}</p>
							<p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100/90 sm:text-sm">{activeGreeting.lang}</p>
						</motion.div>
					)}

					{phase === 'welcome' && (
						<motion.div
							key="ifpc-welcome"
							initial={{ opacity: 0, y: 10, scale: 0.96, filter: 'blur(6px)' }}
							animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
							transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
							className="space-y-3"
						>
							<p className="text-4xl font-black tracking-wide text-white drop-shadow-[0_0_35px_rgba(34,211,238,0.42)] sm:text-6xl">Welcome to IFPC</p>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</motion.div>
	)
}

export default IntroScreen
