import { motion } from 'framer-motion'

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.32, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper
