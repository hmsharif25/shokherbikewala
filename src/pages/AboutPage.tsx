import { motion } from 'framer-motion'
import { Bike, Heart, Shield, Target, Users, Zap } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageTransition from '@/components/ui/PageTransition'

export default function AboutPage() {
  return (
    <PageTransition className="v-shop-page min-h-screen pt-24 sm:pt-28 pb-20 md:pb-16 speed-lines-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12 sm:mb-16">
          <motion.span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-racing tracking-widest mb-4 border border-primary/20 uppercase">
            About Us
          </motion.span>
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-display font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              We Are{' '}
            </span>
            <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent text-glow">
              Shokher Bikewala
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed">
            Your trusted destination for premium bike accessories in Bangladesh. We bring the best quality products for every rider.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="mb-14 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden glass p-1">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/20 via-surface to-cyan/20 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <Bike className="w-24 h-24 text-primary/50" />
                  </motion.div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-cyan/10 rounded-full blur-2xl" />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                Our Story
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Shokher Bikewala started with a simple passion - making quality bike accessories accessible to every rider in Bangladesh. We understand the thrill of the ride and the importance of having the right gear.
              </p>
              <p className="text-gray-400 leading-relaxed">
                From helmets to exhaust systems, from LED lights to riding gloves, we carefully curate products that meet our high standards of quality, safety, and style. Every product in our collection is tested and approved by real riders.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { number: '5000+', label: 'Products Sold' },
                  { number: '2500+', label: 'Happy Riders' },
                  { number: '150+', label: 'Brands' },
                  { number: '4.8', label: 'Avg Rating' },
                ].map((stat) => (
                  <div key={stat.label} className="p-4 rounded-xl glass">
                      <div className="text-xl sm:text-2xl font-display font-bold text-primary">{stat.number}</div>
                      <div className="text-xs sm:text-sm text-gray-400 font-racing">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="mb-14 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our{' '}
            </span>
            <span className="bg-gradient-to-r from-cyan to-primary bg-clip-text text-transparent">
              Values
            </span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[
              { icon: Shield, title: 'Quality First', description: 'Only genuine, certified products make it to our store', color: 'text-primary', bg: 'bg-primary/10' },
              { icon: Heart, title: 'Rider Passion', description: 'We are riders ourselves, we know what you need', color: 'text-pink-400', bg: 'bg-pink-400/10' },
              { icon: Target, title: 'Best Prices', description: 'Competitive pricing without compromising quality', color: 'text-cyan', bg: 'bg-cyan/10' },
              { icon: Zap, title: 'Fast Service', description: 'Quick delivery and responsive customer support', color: 'text-gold', bg: 'bg-gold/10' },
              { icon: Users, title: 'Community', description: 'Building a strong community of bike enthusiasts', color: 'text-purple-400', bg: 'bg-purple-400/10' },
              { icon: Bike, title: 'Innovation', description: 'Always bringing the latest accessories and trends', color: 'text-green-400', bg: 'bg-green-400/10' },
            ].map((value, i) => (
              <AnimatedSection key={value.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.03, transition: { duration: 0.25 } }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 sm:p-6 rounded-2xl glass sb-neon-card sb-card-glow group hover:shadow-xl transition-all border border-white/5 hover:border-primary/15 racing-card"
                >
                  <div className={`w-12 h-12 rounded-xl ${value.bg} flex items-center justify-center mb-4`}>
                    <value.icon className={`w-6 h-6 ${value.color}`} />
                  </div>
                  <h3 className="text-white font-bold text-base sm:text-lg mb-2 font-racing">{value.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{value.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  )
}
