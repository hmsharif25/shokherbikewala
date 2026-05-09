import { lazy } from 'react'
import { motion } from 'framer-motion'
import VHeroSection from '@/components/home/VHeroSection'
import LazySection from '@/components/home/LazySection'

// Hero is the only section that ships with the initial home bundle
// — every section below is fetched on demand as the user scrolls,
// so first paint is just the hero shell.
const VCategoriesGrid = lazy(() => import('@/components/home/VCategoriesGrid'))
const VFeaturedProducts = lazy(
  () => import('@/components/home/VFeaturedProducts')
)
const VPromoBanner = lazy(() => import('@/components/home/VPromoBanner'))
const VCommunity = lazy(() => import('@/components/home/VCommunity'))
const VTestimonials = lazy(() => import('@/components/home/VTestimonials'))
const VFAQ = lazy(() => import('@/components/home/VFAQ'))

/**
 * Velocity homepage — premium futuristic motorbike accessories
 * showroom. The hero ships with the initial bundle; every other
 * section is mounted only as it scrolls into view (LazySection +
 * React.lazy) so first paint is fast on slow networks.
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
      <LazySection>
        <VCategoriesGrid />
      </LazySection>
      <LazySection>
        <VFeaturedProducts />
      </LazySection>
      <LazySection>
        <VPromoBanner />
      </LazySection>
      <LazySection>
        <VCommunity />
      </LazySection>
      <LazySection>
        <VTestimonials />
      </LazySection>
      <LazySection>
        <VFAQ />
      </LazySection>
    </motion.div>
  )
}
