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
	const [isMobileView, setIsMobileView] = useState(() => window.innerWidth < 768)

	const loadingBackgroundStyle = {
		backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.14), rgba(0, 0, 0, 0.24) 62%, rgba(0, 0, 0, 0.34)), url('${IFPC_CANVAS_LOADING_IMAGE_URL}')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	}

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 768)
		}

		handleResize()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	useEffect(() => {
		if (isMobileView) {
			setIsReady(true)
			return undefined
		}

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
	}, [isMobileView])

	if (isMobileView) {
		return (
			<section
				className="relative h-screen min-h-screen w-full overflow-hidden bg-black md:h-[100dvh] md:min-h-[100svh]"
				style={{
					backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.22) 58%, rgba(0, 0, 0, 0.34)), url('${IFPC_CANVAS_LOADING_IMAGE_URL}')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			/>
		)
	}

	return (
		<section ref={sectionRef} className="relative h-screen min-h-screen w-full overflow-hidden bg-black md:h-[100dvh] md:min-h-[100svh]">
			<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label="WpDev camera frame animation" />
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.16)_55%,rgba(0,0,0,0.28))]" />

			<div ref={overlayContentRef} className="hidden" aria-hidden="true" />

			{!isReady ? <div className="absolute inset-0 z-20" style={loadingBackgroundStyle} /> : null}
		</section>
	)
}

export default AdvancedHeroSlider
