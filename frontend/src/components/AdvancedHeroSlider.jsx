import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IFPC_CANVAS_LOADING_IMAGE_URL } from '../utils/branding'

const TOTAL_FRAMES = 192
const START_READY_FRAMES = 42

function frameCandidates(index) {
	const paddedIndex = String(index).padStart(3, '0')

	return [
		`/camera/frame_${paddedIndex}.jpg`,
		`/camera/frame_${paddedIndex}.png`,
		`/camera/frame-${paddedIndex}.jpg`,
		`/camera/frame-${paddedIndex}.png`,
		`/camera/_MConverter.eu_Video_Ready_After_Prompt-${index}.png`,
		`/camera/_MConverter.eu_Video_Ready_After_Prompt-${paddedIndex}.png`,
	]
}

function loadImageWithFallback(candidates) {
	return new Promise((resolve) => {
		const image = new Image()
		image.decoding = 'async'

		let cursor = 0
		const tryNext = () => {
			if (cursor >= candidates.length) {
				resolve(null)
				return
			}

			image.src = candidates[cursor]
			cursor += 1
		}

		image.onload = () => resolve(image)
		image.onerror = () => tryNext()

		tryNext()
	})
}

function drawCoverImage(ctx, canvas, image) {
	const canvasRatio = canvas.width / canvas.height
	const imageRatio = image.naturalWidth / image.naturalHeight

	let drawWidth = canvas.width
	let drawHeight = canvas.height

	if (imageRatio > canvasRatio) {
		drawHeight = canvas.height
		drawWidth = drawHeight * imageRatio
	} else {
		drawWidth = canvas.width
		drawHeight = drawWidth / imageRatio
	}

	const offsetX = (canvas.width - drawWidth) / 2
	const offsetY = (canvas.height - drawHeight) / 2

	ctx.clearRect(0, 0, canvas.width, canvas.height)
	ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

function AdvancedHeroSlider() {
	const sectionRef = useRef(null)
	const canvasRef = useRef(null)
	const overlayContentRef = useRef(null)
	const imageCacheRef = useRef([])
	const loadedCountRef = useRef(0)
	const currentFrameRef = useRef(0)
	const targetFrameRef = useRef(0)
	const renderedFrameRef = useRef(-1)
	const rafIdRef = useRef(0)
	const [isReady, setIsReady] = useState(false)

	const loadingBackgroundStyle = {
		backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.24) 62%, rgba(0, 0, 0, 0.34)), url('${IFPC_CANVAS_LOADING_IMAGE_URL}')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	}

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger)

		const section = sectionRef.current
		const canvas = canvasRef.current
		if (!section || !canvas) return undefined

		const context = canvas.getContext('2d', { alpha: false })
		if (!context) return undefined
		context.imageSmoothingEnabled = true
		context.imageSmoothingQuality = 'high'

		let isMounted = true

		const updateCanvasSize = () => {
			const viewportWidth = section.clientWidth || window.innerWidth
			const viewportHeight = section.clientHeight || window.innerHeight
			const dpr = Math.min(window.devicePixelRatio || 1, 3)

			canvas.width = Math.floor(viewportWidth * dpr)
			canvas.height = Math.floor(viewportHeight * dpr)
			canvas.style.width = `${viewportWidth}px`
			canvas.style.height = `${viewportHeight}px`

			const frameImage = imageCacheRef.current[currentFrameRef.current]
			if (frameImage?.complete) {
				drawCoverImage(context, canvas, frameImage)
			}
		}

		const renderFrame = (frameNumber) => {
			const normalizedFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameNumber))
			const frameImage = imageCacheRef.current[normalizedFrame]
			if (!frameImage?.complete) return

			currentFrameRef.current = normalizedFrame
			drawCoverImage(context, canvas, frameImage)
		}

		const smoothRenderLoop = () => {
			const current = currentFrameRef.current
			const target = targetFrameRef.current
			const eased = current + (target - current) * 0.2
			currentFrameRef.current = eased

			const roundedFrame = Math.round(eased)
			if (roundedFrame !== renderedFrameRef.current) {
				renderedFrameRef.current = roundedFrame
				renderFrame(roundedFrame)
			}

			rafIdRef.current = requestAnimationFrame(smoothRenderLoop)
		}

		const loadAllFrames = async () => {
			let hasStartedExperience = false

			const startExperience = () => {
				if (hasStartedExperience || !isMounted) return
				hasStartedExperience = true

				const firstReadyFrame = imageCacheRef.current.findIndex((frame) => frame?.complete)
				const initialFrame = firstReadyFrame >= 0 ? firstReadyFrame : 0

				setIsReady(true)
				targetFrameRef.current = initialFrame
				currentFrameRef.current = initialFrame
				renderFrame(initialFrame)
				rafIdRef.current = requestAnimationFrame(smoothRenderLoop)

				const trigger = ScrollTrigger.create({
					trigger: section,
					start: 'top top',
					end: '+=300%',
					pin: true,
					scrub: true,
					anticipatePin: 1,
					invalidateOnRefresh: true,
					onUpdate: (self) => {
						targetFrameRef.current = self.progress * (TOTAL_FRAMES - 1)

						if (overlayContentRef.current) {
							const fadeWindow = 0.1
							const contentOpacity = self.progress < fadeWindow ? 1 - self.progress / fadeWindow : 0
							const contentY = Math.min(28, self.progress * 60)
							gsap.set(overlayContentRef.current, { autoAlpha: contentOpacity, y: contentY })
						}
					},
				})

				return trigger
			}

			const imagePromises = []
			for (let frame = 1; frame <= TOTAL_FRAMES; frame += 1) {
				imagePromises.push(
					new Promise((resolve) => {
						loadImageWithFallback(frameCandidates(frame)).then((image) => {
							if (image) {
								imageCacheRef.current[frame - 1] = image
							}
							loadedCountRef.current += 1

							if (loadedCountRef.current >= START_READY_FRAMES) {
								startExperience()
							}
							resolve()
						})
					})
				)
			}

			await Promise.all(imagePromises)
			if (!isMounted) return

			return startExperience()
		}

		updateCanvasSize()
		window.addEventListener('resize', updateCanvasSize)

		const resizeObserver = new ResizeObserver(() => {
			updateCanvasSize()
			ScrollTrigger.refresh()
		})
		resizeObserver.observe(section)

		let activeTrigger
		loadAllFrames().then((trigger) => {
			activeTrigger = trigger
		})

		return () => {
			isMounted = false
			window.removeEventListener('resize', updateCanvasSize)
			resizeObserver.disconnect()
			activeTrigger?.kill()
			cancelAnimationFrame(rafIdRef.current)
		}
	}, [])

	return (
		<section ref={sectionRef} className="relative h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-black">
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="WpDev camera frame animation" />
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.16)_55%,rgba(0,0,0,0.28))]" />

			<div className="relative z-10 flex h-full items-end px-6 pb-14 pt-24 sm:px-10 lg:items-center lg:px-14">
				<div ref={overlayContentRef} className="max-w-xl rounded-2xl border border-white/10 bg-black/5 p-5 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-[1px] sm:p-7">
					<p className="inline-flex rounded-full border border-emerald-300/45 bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
						WpDev Visual Lab
					</p>
					<h1 className="mt-4 text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
						Cinematic Product Disassembly Experience
					</h1>
					<p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
						A 192-frame DSLR teardown rendered on canvas with GSAP-driven scroll sync for fluid, high-fidelity storytelling.
					</p>
					<div className="mt-6 flex flex-wrap gap-3">
						<a href="#projects" className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_10px_24px_rgba(34,211,238,0.42)] hover:bg-emerald-400">
							Explore Work
						</a>
						<a href="#contact" className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20">
							Start Project
						</a>
					</div>
				</div>
			</div>

			<div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center">
				<p className="animate-pulse text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-200/90">Scroll</p>
				<div className="mx-auto mt-2 h-9 w-6 rounded-full border border-white/40">
					<div className="mx-auto mt-1 h-2 w-2 animate-bounce rounded-full bg-emerald-300" />
				</div>
			</div>

			{!isReady ? <div className="absolute inset-0 z-20" style={loadingBackgroundStyle} /> : null}
		</section>
	)
}

export default AdvancedHeroSlider
