import { motion } from 'framer-motion'
import HeroSection from '@/components/home/HeroSection'
import BrandProfile from '@/components/home/BrandProfile'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import CategoriesSection from '@/components/home/CategoriesSection'
import FeaturesSection from '@/components/home/FeaturesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <FeaturesSection />
      <BrandProfile />
      <TestimonialsSection />
    </motion.div>
  )
}
