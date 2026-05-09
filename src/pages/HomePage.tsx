import { lazy } from 'react'
import { motion } from 'framer-motion'
import VHeroSection from '@/components/home/VHeroSection'
import LazySection from '@/components/home/LazySection'
import { useStore } from '@/context/StoreContext'

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
  return (
    <div className="relative" aria-hidden="true">
      <div className="sb-gaming-divider" />
      <div className="sb-energy-divider" />
    </div>
  )
}

export default function HomePage() {
  const { homeSections } = useStore()
  const s = homeSections

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative sb-home-flow"
    >
      {s.hero.visible && <VHeroSection />}
      {s.categories.visible && (
        <>
          <GamingDivider />
          <LazySection><VCategoriesGrid /></LazySection>
        </>
      )}
      {s.featuredProducts.visible && (
        <>
          <GamingDivider />
          <LazySection><VFeaturedProducts /></LazySection>
        </>
      )}
      {s.brandStory.visible && (
        <>
          <GamingDivider />
          <LazySection><VBrandStory /></LazySection>
        </>
      )}
      {s.promoBanner.visible && (
        <>
          <GamingDivider />
          <LazySection><VPromoBanner /></LazySection>
        </>
      )}
      {s.community.visible && (
        <>
          <GamingDivider />
          <LazySection><VCommunity /></LazySection>
        </>
      )}
      {s.testimonials.visible && (
        <>
          <GamingDivider />
          <LazySection><VTestimonials /></LazySection>
        </>
      )}
      {s.faq.visible && (
        <>
          <GamingDivider />
          <LazySection><VFAQ /></LazySection>
        </>
      )}
    </motion.div>
  )
}
