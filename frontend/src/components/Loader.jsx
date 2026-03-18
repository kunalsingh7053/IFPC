import { motion } from 'framer-motion'

function Loader({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-14 w-14">
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-cyan-300/20"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.3, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
        </div>
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </div>
  )
}

export default Loader
