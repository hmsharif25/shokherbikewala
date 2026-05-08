import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  Star,
  Tag,
  Shield,
  Truck,
  Zap,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Share2,
  Heart,
  Package,
} from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageTransition from '@/components/ui/PageTransition'
import { useStore } from '@/context/StoreContext'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { products, categories, brandSettings } = useStore()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <PageTransition className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 text-center py-20">
          <Package className="w-16 h-16 mx-auto text-gray-600 mb-4" />
          <h1 className="text-2xl font-display font-bold text-white mb-2">Product Not Found</h1>
          <p className="text-gray-400 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      </PageTransition>
    )
  }

  const category = categories.find((c) => c.id === product.category_id)
  const relatedProducts = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4)
  const discountPercent = product.discount_price
    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
    : 0

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in ${product.name} (${product.discount_price ? '৳' + product.discount_price.toLocaleString() : '৳' + product.price.toLocaleString()}). Is it available?`
  )

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length)
  }
  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <PageTransition className="min-h-screen pt-20 sm:pt-24 pb-20 md:pb-16 speed-lines-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="mb-6 sm:mb-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-racing tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-16">
          {/* Image Gallery */}
          <AnimatedSection direction="left">
            <div className="space-y-4">
              <motion.div
                className="relative rounded-2xl overflow-hidden glass-premium border border-white/10 group"
                whileHover={{ scale: 1.01 }}
              >
                <div className="aspect-square relative">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-50/50 via-transparent to-transparent" />
                </div>

                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {discountPercent > 0 && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-primary rounded-full text-sm font-bold text-white flex items-center gap-1.5 animate-pulse-glow">
                    <Tag className="w-3.5 h-3.5" />
                    {discountPercent}% OFF
                  </div>
                )}

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-2.5 rounded-xl glass transition-all ${
                      isWishlisted ? 'text-red-500 bg-red-500/10' : 'text-gray-300 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="p-2.5 rounded-xl glass text-gray-300 hover:text-cyan transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(i)}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === i
                          ? 'border-primary shadow-lg shadow-primary/20'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection direction="right" className="space-y-6">
            {category && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-cyan font-racing tracking-widest uppercase border border-cyan/20"
              >
                <Zap className="w-3 h-3" />
                {category.name}
              </motion.div>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-gray-400 text-sm font-racing">(4.8 / 5.0)</span>
              <span className="text-gray-600">|</span>
              <span className="text-green-400 text-sm font-medium">
                {product.in_stock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="p-5 rounded-xl glass border border-white/5">
              <div className="flex items-end gap-4">
                {product.discount_price ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-display font-bold text-primary text-glow">
                      ৳{product.discount_price.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 line-through mb-1">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-full mb-1">
                      Save ৳{(product.price - product.discount_price).toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl sm:text-4xl font-display font-bold text-primary text-glow">
                    ৳{product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2 font-racing tracking-wide">Description</h3>
              <p className="text-gray-400 leading-relaxed">{product.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, label: 'Certified Quality', color: 'text-primary', bg: 'bg-primary/10' },
                { icon: Truck, label: 'Fast Delivery', color: 'text-cyan', bg: 'bg-cyan/10' },
                { icon: Zap, label: 'Best Price', color: 'text-gold', bg: 'bg-gold/10' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="p-3 rounded-xl glass border border-white/5 text-center"
                >
                  <div className={`w-8 h-8 mx-auto rounded-lg ${feature.bg} flex items-center justify-center mb-2`}>
                    <feature.icon className={`w-4 h-4 ${feature.color}`} />
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-300 font-racing">{feature.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.a
                href={`${brandSettings.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-green-500/30 transition-shadow font-racing tracking-wide"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </motion.a>
              <motion.a
                href={`${brandSettings.whatsapp}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-shadow animate-pulse-glow font-racing tracking-wide"
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </motion.a>
            </div>
          </AnimatedSection>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <AnimatedSection className="mt-12">
            <div className="racing-stripe-divider mb-10 rounded-full" />
            <h2 className="text-xl sm:text-2xl font-display font-bold mb-8">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Related{' '}
              </span>
              <span className="bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">
                Products
              </span>
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map((rp, i) => (
                <AnimatedSection key={rp.id} delay={i * 0.1}>
                  <Link to={`/products/${rp.slug}`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="group rounded-2xl overflow-hidden glass-premium racing-card hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 border border-white/5 hover:border-primary/15"
                    >
                      <div className="relative h-32 sm:h-48 overflow-hidden">
                        <img
                          src={rp.images[0]}
                          alt={rp.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />
                        {rp.discount_price && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary rounded-full text-[10px] sm:text-xs font-bold text-white flex items-center gap-0.5">
                            <Tag className="w-2.5 h-2.5" />
                            {Math.round(((rp.price - rp.discount_price) / rp.price) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 sm:p-4">
                        <h3 className="text-white font-bold text-xs sm:text-base mb-1 group-hover:text-primary transition-colors line-clamp-1 font-racing">
                          {rp.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-sm sm:text-lg font-display font-bold text-primary">
                            ৳{(rp.discount_price || rp.price).toLocaleString()}
                          </span>
                          {rp.discount_price && (
                            <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                              ৳{rp.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </PageTransition>
  )
}
