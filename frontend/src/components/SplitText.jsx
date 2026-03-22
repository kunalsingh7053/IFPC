import { motion } from 'framer-motion'

function SplitText({
  text,
  className = '',
  tag = 'h1',
  delay = 0,
  stagger = 0.045,
  once = true,
}) {
  const MotionTag = motion[tag] || motion.h1
  const chars = Array.from(text || '')

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.65 }}
      className={className}
      aria-label={text}
    >
      {chars.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={{
            hidden: {
              opacity: 0,
              y: 16,
              scale: 0.96,
              filter: 'blur(8px)',
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              transition: {
                duration: 0.46,
                delay: delay + index * stagger,
                ease: [0.22, 1, 0.36, 1],
              },
            },
          }}
          className="inline-block will-change-transform"
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </MotionTag>
  )
}

export default SplitText
