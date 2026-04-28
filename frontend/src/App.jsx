import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import Mainroutes from './routes/Mainroutes'
import AnimatedCursor from './components/AnimatedCursor'
import IFPCFaqChatbot from './components/IFPCFaqChatbot'
import HelloIntro from './components/HelloIntro'
import ScrollTopButton from './components/ScrollTopButton'

function App() {
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1,
      smoothWheel: true,
      smoothTouch: false,
    })

    let rafId = 0

    const raf = (time) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    rafId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  function handleIntroDone() {
    setShowIntro(false)
  }

  return (
    <>
      <AnimatedCursor />
      <AnimatePresence>{showIntro ? <HelloIntro onComplete={handleIntroDone} /> : null}</AnimatePresence>
      {!showIntro ? (
        <>
          <IFPCFaqChatbot />
          <ScrollTopButton />
          <Mainroutes />
        </>
      ) : null}
    </>
  )
}

export default App
