import { lazy } from 'react'
import { motion } from 'framer-motion'
import VHeroSection from '@/components/home/VHeroSection'
import LazySection from '@/components/home/LazySection'

// Hero is the only section that ships with the initial home bundle
// — every section below is fetched on demand as the user scrolls,
// so first paint is just the cinematic hero.
const VCategoriesGrid = lazy(() => import('@/components/home/VCategoriesGrid'))
const VFeaturedProducts = lazy(
  () => import('@/components/home/VFeaturedProducts')
)
const VBrandStory = lazy(() => import('@/components/home/VBrandStory'))
const VPromoBanner = lazy(() => import('@/components/home/VPromoBanner'))
const VCommunity = lazy(() => import('@/components/home/VCommunity'))
const VTestimonials = lazy(() => import('@/components/home/VTestimonials'))
const VFAQ = lazy(() => import('@/components/home/VFAQ'))

function GamingDivider() {
  return <div className="sb-gaming-divider" aria-hidden="true" />
}

/**
 * Velocity homepage — premium futuristic motorbike accessories
 * showroom. The hero ships with the initial bundle; every other
 * section is mounted only as it scrolls into view (LazySection +
 * React.lazy) so first paint is fast on slow networks.
 *
 * Section order matches the brief:
 *   1. Cinematic hero
 *   2. Featured categories (Gear Up. Ride Better.)
 *   3. Featured products (Premium Selection)
 *   4. Lifestyle / "Engineered For Riders" showroom (VBrandStory)
 *   5. Promotional banner ("Premium Riding Gear / 40% off")
 *   6. Community / social showcase
 *   7. Testimonials
 *   8. FAQ
 */
export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative sb-home-flow"
    >
      <VHeroSection />
      <GamingDivider />
      <LazySection>
        <VCategoriesGrid />
      </LazySection>
      <GamingDivider />
      <LazySection>
        <VFeaturedProducts />
      </LazySection>
      <GamingDivider />
      <LazySection>
        <VBrandStory />
      </LazySection>
      <GamingDivider />
      <LazySection>
        <VPromoBanner />
      </LazySection>
      <GamingDivider />
      <LazySection>
        <VCommunity />
      </LazySection>
      <GamingDivider />
      <LazySection>
        <VTestimonials />
      </LazySection>
      <GamingDivider />
      <LazySection>
        <VFAQ />
      </LazySection>
    </motion.div>
  )
}
