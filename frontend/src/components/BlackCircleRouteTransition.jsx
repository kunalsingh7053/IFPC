import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const INITIAL_CIRCLE_SIZE = 96

function BlackCircleRouteTransition() {
	const [targetScale, setTargetScale] = useState(24)

	useEffect(() => {
		function updateScale() {
			const width = window.innerWidth
			const height = window.innerHeight
			const diagonal = Math.hypot(width, height)
			// Circle center is pinned to top-left corner, so radius must cover full diagonal.
			const scale = (2 * diagonal) / INITIAL_CIRCLE_SIZE
			setTargetScale(scale)
		}

		updateScale()
		window.addEventListener('resize', updateScale)

		return () => {
			window.removeEventListener('resize', updateScale)
		}
	}, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.26, ease: 'easeOut' }}
      className="pointer-events-none fixed inset-0 z-[20000] overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: targetScale }}
        exit={{ scale: 0, opacity: 0.95 }}
        transition={{
          scale: { duration: 0.82, ease: [0.76, 0.01, 0.21, 1] },
          opacity: { duration: 0.28, ease: 'easeOut' },
        }}
        className="absolute left-0 top-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black shadow-[0_0_85px_rgba(0,0,0,0.48)]"
        style={{ willChange: 'transform, opacity' }}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0.32 }}
        animate={{ scale: targetScale * 1.04, opacity: 0.22 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          scale: { duration: 0.92, ease: [0.76, 0.01, 0.21, 1] },
          opacity: { duration: 0.36, ease: 'easeOut' },
        }}
        className="absolute left-0 top-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black"
        style={{ willChange: 'transform, opacity' }}
      />
    </motion.div>
  )
}

export default BlackCircleRouteTransition
