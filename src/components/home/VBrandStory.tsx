import { Link } from 'react-router-dom'
import { ArrowRight, Award, PackageCheck, Settings, Shield } from 'lucide-react'
import VReveal from '@/components/ui/VReveal'

const PILLARS = [
  { icon: Shield, title: 'Premium Quality', text: 'Curated accessories with trusted finishing and fit.' },
  { icon: Settings, title: 'Rider Focused', text: 'Simple choices for daily ride comfort and style.' },
  { icon: PackageCheck, title: 'Fast Delivery', text: 'Quick response and WhatsApp-first order support.' },
  { icon: Award, title: 'Trusted By Riders', text: 'Built around the Bangladesh biker community.' },
]

export default function VBrandStory() {
  return (
    <section className="sb-clean-section sb-brand-story relative py-16 sm:py-20 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-center">
          <VReveal className="text-center lg:text-left">
            <span className="v-eyebrow">Why Shokher Bikewala</span>
            <h2 className="v-headline text-4xl sm:text-5xl md:text-6xl mt-4 mb-5">
              Premium, <em>not noisy</em>
            </h2>
            <p className="text-fg-muted text-base sm:text-lg leading-relaxed font-ui max-w-xl mx-auto lg:mx-0">
              A clean biker shopping experience with subtle gaming energy: white and orange in light mode, black and orange in dark mode, smooth motion everywhere.
            </p>
            <Link to="/about" className="sb-secondary-btn mt-7 inline-flex">
              Explore Story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </VReveal>

          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {PILLARS.map((pillar, index) => (
              <VReveal key={pillar.title} delay={index * 80}>
                <article className="sb-simple-card sb-feature-card">
                  <span className="sb-mini-icon static mb-4">
                    <pillar.icon className="w-5 h-5" />
                  </span>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                </article>
              </VReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
