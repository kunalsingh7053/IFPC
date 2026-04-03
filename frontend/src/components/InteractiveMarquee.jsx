import { motion } from 'framer-motion'
import { IFPC_LOGO_URL } from '../utils/branding'

const ifpcRows = [
  {
    items: [
      { label: 'IFPC', icon: IFPC_LOGO_URL },
      { label: 'CINEMATIC STORYTELLING' },
      { label: 'FILM PRODUCTION' },
      { label: 'VISUAL DIRECTION' },
      { label: 'PHOTOGRAPHY' },
    ],
    duration: 34,
    reverse: false,
  },
  {
    items: [
      { label: 'CREATIVE EXCELLENCE' },
      { label: 'POST PRODUCTION' },
      { label: 'LIGHTING DESIGN' },
      { label: 'COLOR SCIENCE' },
      { label: 'LIVE PROJECTS' },
    ],
    duration: 40,
    reverse: true,
  },
]

const developerRows = [
  {
    items: [
      { label: 'REACT' },
      { label: 'JAVASCRIPT' },
      { label: 'NODE.JS' },
      { label: 'MONGODB' },
      { label: 'API DESIGN' },
    ],
    duration: 30,
    reverse: false,
  },
  {
    items: [
      { label: 'TAILWIND CSS' },
      { label: 'MOTION' },
      { label: 'UI / UX' },
      { label: 'PERFORMANCE' },
      { label: 'FULL STACK' },
    ],
    duration: 36,
    reverse: true,
  },
]

function MarqueeItem({ item }) {
  return (
    <motion.span whileHover={{ y: -2, scale: 1.03 }} transition={{ duration: 0.2 }} className="marquee-item">
      {item.icon ? (
        <span className="marquee-item-icon">
          <img src={item.icon} alt={item.label} loading="lazy" className="h-full w-full object-contain" />
        </span>
      ) : null}
      <span>{item.label}</span>
    </motion.span>
  )
}

function MarqueeRow({ row }) {
  const duplicated = [...row.items, ...row.items]

  return (
    <div className="marquee-wrapper">
      <div
        className={`marquee-track marquee-track-live ${row.reverse ? 'marquee-track-reverse' : ''}`}
        style={{ '--marquee-duration': `${row.duration}s` }}
      >
        {duplicated.map((item, index) => (
          <MarqueeItem key={`${item.label}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}

function InteractiveMarquee({ variant = 'ifpc', fullScreen = false }) {
  const rows = variant === 'developer' ? developerRows : ifpcRows
  const title = variant === 'developer' ? 'Tech Stack' : 'IFPC Motion Identity'

  return (
    <section className={`marquee-section px-6 sm:px-10 lg:px-16 ${fullScreen ? 'py-12' : 'py-10'}`}>
      <div className={`marquee-shell ${fullScreen ? 'max-w-[96rem]' : 'max-w-7xl'}`}>
        <div className="marquee-head">
          <p>{title}</p>
        </div>

        {rows.map((row, index) => (
          <MarqueeRow key={`${variant}-${index}`} row={row} />
        ))}
      </div>
    </section>
  )
}

export default InteractiveMarquee