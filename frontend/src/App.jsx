import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Mainroutes from './routes/Mainroutes'
import AnimatedCursor from './components/AnimatedCursor'
import IFPCFaqChatbot from './components/IFPCFaqChatbot'
import IntroScreen from './components/IntroScreen'

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const navigate = useNavigate()

  function handleIntroDone() {
    setShowIntro(false)
    navigate('/')
  }

  return (
    <>
      <AnimatedCursor />
      <AnimatePresence>{showIntro ? <IntroScreen onDone={handleIntroDone} /> : null}</AnimatePresence>
      {!showIntro ? (
        <>
          <IFPCFaqChatbot />
          <Mainroutes />
        </>
      ) : null}
    </>
  )
}

export default App
