import { motion } from 'framer-motion'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.992 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.994 }}
      transition={{ duration: 0.38, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper
