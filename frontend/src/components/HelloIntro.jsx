import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

const GREETINGS = [
  'नमस्ते',
  'السلام علیکم',
  'Hola',
  'こんにちは',
  '안녕하세요'
]
const NAME_LINE = 'Ikshana Film and Photography Community'

export default function HelloIntro({ onComplete, reducedMotion = false }) {
  const [phase, setPhase] = useState('greet')
  const [wordIndex, setWordIndex] = useState(0)
  const [typedCount, setTypedCount] = useState(0)

  const activeWord = GREETINGS[wordIndex]
  const typedText = useMemo(() => NAME_LINE.slice(0, typedCount), [typedCount])

  useEffect(() => {
    if (phase !== 'greet') return undefined

    if (wordIndex >= GREETINGS.length - 1) {
      const toTypeTimer = window.setTimeout(() => {
        setPhase('type')
      }, reducedMotion ? 180 : 450)
      return () => window.clearTimeout(toTypeTimer)
    }

    const wordTimer = window.setTimeout(() => {
      setWordIndex(prev => prev + 1)
    }, reducedMotion ? 130 : 430)

    return () => window.clearTimeout(wordTimer)
  }, [phase, wordIndex, reducedMotion])

  useEffect(() => {
    if (phase !== 'type') return undefined

    if (typedCount < NAME_LINE.length) {
      const typeTimer = window.setTimeout(() => {
        setTypedCount(prev => prev + 1)
      }, reducedMotion ? 24 : 70)
      return () => window.clearTimeout(typeTimer)
    }

    const finishTimer = window.setTimeout(() => {
      onComplete?.()
    }, reducedMotion ? 220 : 800)

    return () => window.clearTimeout(finishTimer)
  }, [phase, typedCount, onComplete, reducedMotion])

  return (
    <motion.div
      className="hello-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      aria-hidden="true"
    >
      <div className="hello-intro__bg" />
      <motion.p
        className="hello-intro__word"
        key={activeWord}
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {activeWord}
      </motion.p>
      <p className="hello-intro__sub">Welcome to IFPC Portal</p>
      <p className="hello-intro__name" aria-label={NAME_LINE}>
        {typedText}
        <span className="hello-intro__caret" aria-hidden="true">|</span>
      </p>
      <motion.div
        className="hello-intro__pulse"
        initial={{ scale: 0.65, opacity: 0 }}
        animate={{ scale: 1.25, opacity: [0, 0.22, 0] }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </motion.div>
  )
}
