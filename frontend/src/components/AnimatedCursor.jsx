import { useEffect, useRef, useState } from 'react'

function AnimatedCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const frameRef = useRef(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const ringRefPos = useRef({ x: 0, y: 0 })
  const ringScaleRef = useRef(1)
  const pointerStateRef = useRef(false)
  const pressedStateRef = useRef(false)
  const labelStateRef = useRef('')

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
        const hasLabel = Boolean(labelStateRef.current)
        const targetScale = pressedStateRef.current ? 0.78 : hasLabel ? 2.35 : pointerStateRef.current ? 2.05 : 1
        ringScaleRef.current += (targetScale - ringScaleRef.current) * 0.2

        ringRef.current.style.transform = `translate3d(${ringRefPos.current.x}px, ${ringRefPos.current.y}px, 0) scale(${ringScaleRef.current})`
        ringRef.current.style.borderColor = hasLabel
          ? 'var(--ifpc-cursor-label-ring)'
          : pointerStateRef.current
            ? 'var(--ifpc-cursor-hover)'
            : 'var(--ifpc-cursor-ring)'
        ringRef.current.style.boxShadow = hasLabel
          ? '0 0 30px rgba(255, 255, 255, 0.35), 0 0 42px rgba(34, 211, 238, 0.45)'
          : pointerStateRef.current
          ? '0 0 28px rgba(245, 158, 11, 0.48)'
          : '0 0 24px rgba(34, 211, 238, 0.35)'
      }

      if (dotRef.current) {
        const dotScale = pointerStateRef.current || labelStateRef.current ? 0.76 : 1
        dotRef.current.style.transform = `translate3d(${mouseRef.current.x}px, ${mouseRef.current.y}px, 0) scale(${dotScale})`
      }

      if (labelRef.current) {
        const hasLabel = Boolean(labelStateRef.current)
        labelRef.current.style.transform = `translate3d(${ringRefPos.current.x}px, ${ringRefPos.current.y}px, 0) scale(${hasLabel ? 1 : 0.85})`
        labelRef.current.style.opacity = hasLabel ? '1' : '0'
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
      const labelled = target?.closest('[data-cursor-label]')
      labelStateRef.current = labelled?.getAttribute('data-cursor-label')?.trim() || ''

      if (labelRef.current) {
        labelRef.current.textContent = labelStateRef.current
      }

      const next = Boolean(interactive)
      pointerStateRef.current = next
    }

    const handleMouseDown = (event) => {
      if (event.button !== 0) {
        return
      }
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
      <div ref={labelRef} className="custom-cursor-label" aria-hidden="true" />
    </>
  )
}

export default AnimatedCursor
