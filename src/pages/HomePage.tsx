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

function SectionDivider() {
  return (
    <div className="mx-auto max-w-[60%] h-px bg-gradient-to-r from-transparent via-line/30 to-transparent" aria-hidden="true" />
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
          <SectionDivider />
          <LazySection><VCategoriesGrid /></LazySection>
        </>
      )}
      {s.featuredProducts.visible && (
        <>
          <SectionDivider />
          <LazySection><VFeaturedProducts /></LazySection>
        </>
      )}
      {s.brandStory.visible && (
        <>
          <SectionDivider />
          <LazySection><VBrandStory /></LazySection>
        </>
      )}
      {s.promoBanner.visible && (
        <>
          <SectionDivider />
          <LazySection><VPromoBanner /></LazySection>
        </>
      )}
      {s.community.visible && (
        <>
          <SectionDivider />
          <LazySection><VCommunity /></LazySection>
        </>
      )}
      {s.testimonials.visible && (
        <>
          <SectionDivider />
          <LazySection><VTestimonials /></LazySection>
        </>
      )}
      {s.faq.visible && (
        <>
          <SectionDivider />
          <LazySection><VFAQ /></LazySection>
        </>
      )}
    </motion.div>
  )
}
