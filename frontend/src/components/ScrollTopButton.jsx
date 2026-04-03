import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function ScrollTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 320)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          type="button"
          onClick={handleScrollTop}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.92 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-[10950] grid h-12 w-12 place-items-center rounded-full border border-cyan-200/45 bg-[linear-gradient(145deg,rgba(34,211,238,0.18),rgba(245,158,11,0.18))] text-white shadow-[0_12px_30px_rgba(0,0,0,0.38)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:shadow-[0_16px_34px_rgba(34,211,238,0.35)] sm:bottom-7 sm:right-7"
          aria-label="Scroll to top"
          data-cursor-label="Top"
        >
          <span className="text-xl leading-none">↑</span>
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}

export default ScrollTopButton