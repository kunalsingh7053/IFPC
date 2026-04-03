import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Mainroutes from './routes/Mainroutes'
import AnimatedCursor from './components/AnimatedCursor'
import IFPCFaqChatbot from './components/IFPCFaqChatbot'
import HelloIntro from './components/HelloIntro'
import ScrollTopButton from './components/ScrollTopButton'

function App() {
  const [showIntro, setShowIntro] = useState(true)

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
