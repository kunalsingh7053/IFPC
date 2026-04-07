import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { IFPC_LOGO_URL } from '../utils/branding'

const PillNav = ({
  logo,
  logoAlt = 'Logo',
  items = [],
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  pillGap = '8px',
  pillPadX = '22px',
  onMobileMenuClick,
  initialLoadAnimation = true,
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor
  const resolvedLogo = logo || IFPC_LOGO_URL
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logoLoadError, setLogoLoadError] = useState(false)
  const circleRefs = useRef([])
  const tlRefs = useRef([])
  const activeTweenRefs = useRef([])
  const logoImgRef = useRef(null)
  const logoTweenRef = useRef(null)
  const hamburgerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const navItemsRef = useRef(null)
  const logoRef = useRef(null)
  const navRootRef = useRef(null)

  useEffect(() => {
    setLogoLoadError(false)
  }, [resolvedLogo])

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return

        const pill = circle.parentElement
        const rect = pill.getBoundingClientRect()
        const { width: w, height: h } = rect
        const R = ((w * w) / 4 + h * h) / (2 * h)
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        })

        const label = pill.querySelector('.pill-label')
        const white = pill.querySelector('.pill-label-hover')

        if (label) gsap.set(label, { y: 0 })
        if (white) gsap.set(white, { y: h + 12, opacity: 0 })

        const index = circleRefs.current.indexOf(circle)
        if (index === -1) return

        tlRefs.current[index]?.kill()
        const tl = gsap.timeline({ paused: true })

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0)

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 })
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
        }

        tlRefs.current[index] = tl
      })
    }

    layout()

    const onResize = () => layout()
    window.addEventListener('resize', onResize)

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {})
    }

    const menu = mobileMenuRef.current
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, scaleY: 1, y: 0 })
    }

    if (initialLoadAnimation) {
      const logoEl = logoRef.current
      const navItems = navItemsRef.current

      if (logoEl) {
        gsap.set(logoEl, { scale: 0 })
        gsap.to(logoEl, {
          scale: 1,
          duration: 0.6,
          ease,
        })
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' })
        gsap.to(navItems, {
          width: 'auto',
          duration: 0.6,
          ease,
        })
      }
    }

    return () => {
      window.removeEventListener('resize', onResize)
      activeTweenRefs.current.forEach((tween) => tween?.kill())
      tlRefs.current.forEach((timeline) => timeline?.kill())
      logoTweenRef.current?.kill()
    }
  }, [items, ease, initialLoadAnimation])

  const handleEnter = (i) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLeave = (i) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    activeTweenRefs.current[i]?.kill()
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const handleLogoEnter = () => {
    const img = logoImgRef.current
    if (!img) return
    logoTweenRef.current?.kill()
    gsap.set(img, { rotate: 0 })
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto',
    })
  }

  const setMobileMenuState = useCallback((nextOpen) => {
    setIsMobileMenuOpen(nextOpen)

    const hamburger = hamburgerRef.current
    const menu = mobileMenuRef.current

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line')
      if (nextOpen) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease })
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease })
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease })
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease })
      }
    }

    if (menu) {
      if (nextOpen) {
        gsap.set(menu, { visibility: 'visible' })
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease,
            transformOrigin: 'top center',
          }
        )
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' })
          },
        })
      }
    }

    onMobileMenuClick?.()
  }, [ease, onMobileMenuClick])

  const toggleMobileMenu = () => {
    setMobileMenuState(!isMobileMenuOpen)
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    const handlePointerDown = (event) => {
      const root = navRootRef.current
      if (root && !root.contains(event.target)) {
        setMobileMenuState(false)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuState(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileMenuOpen, setMobileMenuState])

  const isExternalLink = (href = '') =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#')

  const isRouterLink = (href) => href && !isExternalLink(href)

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--logo']: '36px',
    ['--pill-pad-x']: pillPadX,
    ['--pill-gap']: pillGap,
  }

  return (
    <div ref={navRootRef} className="fixed top-[1em] left-0 z-[12000] flex w-full justify-center px-4">
      <nav
        className={`box-border flex w-full items-center justify-between rounded-full border border-white/70 px-1 py-1 md:w-max md:justify-center ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {isRouterLink(items?.[0]?.href) ? (
          <Link
            to={items[0].href}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={(el) => {
              logoRef.current = el
            }}
            className="inline-flex items-center justify-center overflow-hidden rounded-full p-2"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: '#000000',
            }}
          >
            {logoLoadError ? (
              <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-white">IFPC</span>
            ) : (
              <img
                src={resolvedLogo}
                alt={logoAlt}
                ref={logoImgRef}
                className="block h-full w-full object-contain"
                onError={() => setLogoLoadError(true)}
              />
            )}
          </Link>
        ) : (
          <a
            href={items?.[0]?.href || '#'}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={(el) => {
              logoRef.current = el
            }}
            className="inline-flex items-center justify-center overflow-hidden rounded-full p-2"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: '#000000',
            }}
          >
            {logoLoadError ? (
              <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-white">IFPC</span>
            ) : (
              <img
                src={resolvedLogo}
                alt={logoAlt}
                ref={logoImgRef}
                className="block h-full w-full object-contain"
                onError={() => setLogoLoadError(true)}
              />
            )}
          </a>
        )}

        <div
          ref={navItemsRef}
          className="relative ml-2 hidden items-center rounded-full md:flex"
          style={{
            height: 'var(--nav-h)',
            background: 'var(--base, #000)',
          }}
        >
          <ul
            role="menubar"
            className="m-0 flex h-full list-none items-stretch p-[3px]"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href

              const pillStyle = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)',
              }

              const PillContent = (
                <>
                  <span
                    className="hover-circle pointer-events-none absolute bottom-0 left-1/2 z-[1] block rounded-full"
                    style={{
                      background: 'var(--base, #000)',
                      willChange: 'transform',
                    }}
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el
                    }}
                  />
                  <span className={`label-stack relative z-[2] inline-flex items-center gap-2 leading-[1] ${item.blink ? 'animate-pulse' : ''}`}>
                    <span className="pill-label relative z-[2] inline-flex items-center gap-2 leading-[1]" style={{ willChange: 'transform' }}>
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-emerald-100 shadow-[0_0_8px_rgba(220,255,235,0.85)]' : 'bg-transparent'
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-flex items-center gap-2"
                      style={{
                        color: 'var(--hover-text, #fff)',
                        willChange: 'transform, opacity',
                      }}
                      aria-hidden="true"
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-emerald-100 shadow-[0_0_8px_rgba(220,255,235,0.85)]' : 'bg-transparent'
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                  </span>
                </>
              )

              const basePillClasses =
                'relative inline-flex h-full cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap rounded-full box-border px-0 text-[16px] font-semibold uppercase leading-[0] tracking-[0.2px] no-underline'

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded-full border border-emerald-300/35 p-0 shadow-[0_10px_26px_rgba(0,0,0,0.38)] backdrop-blur-xl md:hidden"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            background: 'linear-gradient(150deg,rgba(10,22,16,0.92),rgba(7,18,13,0.86))',
          }}
        >
          <span
            className="hamburger-line h-0.5 w-4.5 origin-center rounded transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: '#d8ffe5' }}
          />
          <span
            className="hamburger-line h-0.5 w-4.5 origin-center rounded transition-all duration-[10ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
            style={{ background: '#d8ffe5' }}
          />
        </button>
      </nav>

      <div
        ref={mobileMenuRef}
        className="absolute left-4 right-4 top-[3.4em] z-[998] origin-top rounded-[24px] border border-emerald-300/25 shadow-[0_16px_42px_rgba(0,0,0,0.34)] backdrop-blur-2xl md:hidden"
        style={{
          ...cssVars,
          background: 'linear-gradient(165deg,rgba(8,18,14,0.96),rgba(8,16,13,0.92))',
        }}
      >
        <ul className="m-0 flex list-none flex-col gap-2 p-3">
          {items.map((item) => {
            const isActive = activeHref === item.href
            const defaultStyle = {
              background: isActive ? 'linear-gradient(140deg,#1db954,#22c55e)' : 'rgba(255,255,255,0.06)',
              color: isActive ? '#04210f' : '#eafff0',
              border: isActive ? '1px solid rgba(34,197,94,0.55)' : '1px solid rgba(255,255,255,0.1)',
            }
            const hoverIn = (e) => {
              if (isActive) return
              e.currentTarget.style.background = 'rgba(29,185,84,0.18)'
              e.currentTarget.style.color = '#dcffe8'
              e.currentTarget.style.border = '1px solid rgba(52,211,153,0.45)'
            }
            const hoverOut = (e) => {
              if (isActive) {
                e.currentTarget.style.background = 'linear-gradient(140deg,#1db954,#22c55e)'
                e.currentTarget.style.color = '#04210f'
                e.currentTarget.style.border = '1px solid rgba(34,197,94,0.55)'
                return
              }
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = '#eafff0'
              e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'
            }

            const linkClasses =
              'flex items-center justify-between rounded-[16px] px-4 py-3 text-[15px] font-semibold uppercase tracking-[0.06em] transition-all duration-200 ease-[cubic-bezier(0.25,0.1,0.25,1)]'

            const LabelContent = (
              <span className={`inline-flex items-center gap-2 ${item.blink ? 'animate-pulse' : ''}`}>
                <span
                  aria-hidden="true"
                  className={`h-2 w-2 rounded-full ${
                    isActive ? 'bg-emerald-50 shadow-[0_0_10px_rgba(255,255,255,0.85)]' : 'bg-transparent'
                  }`}
                />
                <span>{item.label}</span>
              </span>
            )

            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    to={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setMobileMenuState(false)}
                  >
                    {LabelContent}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setMobileMenuState(false)}
                  >
                    {LabelContent}
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default PillNav
