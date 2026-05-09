import { motion } from 'framer-motion'
import VHeroSection from '@/components/home/VHeroSection'
import VCategoriesGrid from '@/components/home/VCategoriesGrid'
import VFeaturedProducts from '@/components/home/VFeaturedProducts'
import VBrandStory from '@/components/home/VBrandStory'
import VPromoBanner from '@/components/home/VPromoBanner'
import VNewArrivals from '@/components/home/VNewArrivals'
import VCommunity from '@/components/home/VCommunity'
import VTestimonials from '@/components/home/VTestimonials'
import VFAQ from '@/components/home/VFAQ'

/**
 * Velocity homepage — premium futuristic motorbike accessories
 * showroom. Sections follow the brief order: hero, categories,
 * featured, brand story, promo, new arrivals, community,
 * testimonials, FAQ. The premium footer renders globally in App.
 */
export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <VHeroSection />
      <VCategoriesGrid />
      <VFeaturedProducts />
      <VBrandStory />
      <VPromoBanner />
      <VNewArrivals />
      <VCommunity />
      <VTestimonials />
      <VFAQ />
    </motion.div>
  )
}
