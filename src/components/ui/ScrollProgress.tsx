import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 })

  return (
    <motion.div
      className="sb-scroll-progress"
      style={{ scaleX }}
    />
  )
}
