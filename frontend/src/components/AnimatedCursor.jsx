import { useEffect, useRef, useState } from 'react'

function AnimatedCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const frameRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const ringRefPos = useRef({ x: 0, y: 0 })
  const pointerStateRef = useRef(false)
  const pressedStateRef = useRef(false)

  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const canUseCustomCursor = window.matchMedia('(pointer: fine)').matches

    if (!canUseCustomCursor) {
      return undefined
    }

    setEnabled(true)
    document.body.classList.add('cursor-custom-enabled')

    const updateDotPosition = () => {
      if (!dotRef.current) {
        return
      }
      dotRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0)`
    }

    const animateRing = () => {
      const dx = mouseRef.current.x - ringRefPos.current.x
      const dy = mouseRef.current.y - ringRefPos.current.y

      ringRefPos.current.x += dx * 0.18
      ringRefPos.current.y += dy * 0.18

      if (ringRef.current) {
        const scale = pressedStateRef.current ? 0.72 : pointerStateRef.current ? 1.35 : 1
        ringRef.current.style.transform = `translate3d(${ringRefPos.current.x}px, ${ringRefPos.current.y}px, 0) scale(${scale})`
        ringRef.current.style.borderColor = pointerStateRef.current ? 'rgba(245, 158, 11, 0.95)' : 'rgba(34, 211, 238, 0.8)'
      }

      frameRef.current = window.requestAnimationFrame(animateRing)
    }

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX
      mouseRef.current.y = event.clientY
      updateDotPosition()
    }

    const handlePointerOver = (event) => {
      const target = event.target instanceof Element ? event.target : null
      const interactive = target?.closest('a, button, input, textarea, select, label, [role="button"], [data-cursor="pointer"]')
      const next = Boolean(interactive)
      pointerStateRef.current = next
    }

    const handleMouseDown = () => {
      pressedStateRef.current = true
    }

    const handleMouseUp = () => {
      pressedStateRef.current = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handlePointerOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    frameRef.current = window.requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handlePointerOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.cancelAnimationFrame(frameRef.current)
      document.body.classList.remove('cursor-custom-enabled')
    }
  }, [])

  if (!enabled) {
    return null
  }

  return (
    <>
      <div ref={ringRef} className="custom-cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor-dot" aria-hidden="true" />
    </>
  )
}

export default AnimatedCursor
