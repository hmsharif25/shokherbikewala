import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  Check,
  Star,
  Tag,
  Shield,
  Truck,
  Zap,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Share2,
  Package,
  FileText,
  ClipboardList,
  MessageSquare,
  User,
  ThumbsUp,
} from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageTransition from '@/components/ui/PageTransition'
import { useStore } from '@/context/StoreContext'
import { useCart } from '@/context/CartContext'
import type { ProductReview } from '@/types'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { products, categories, brandSettings } = useStore()
  const { addItem } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [justAdded, setJustAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description')
  const [reviewForm, setReviewForm] = useState({ author: '', rating: 5, text: '' })
  const [localReviews, setLocalReviews] = useState<ProductReview[]>([])

  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <PageTransition className="v-shop-page min-h-screen pt-4 sm:pt-24 pb-20">
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

  const allReviews = [...localReviews, ...(product.reviews ?? [])]
  const avgRating = allReviews.length > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    : 0

  return (
    <PageTransition className="v-shop-page min-h-screen pt-4 sm:pt-28 pb-32 md:pb-16 speed-lines-bg">
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
                    decoding="async"
                    fetchPriority="high"
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
                      <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
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

            {(product.short_description || product.description) && (
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                {product.short_description || product.description.slice(0, 120) + '…'}
              </p>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating || 4.8) ? 'fill-gold text-gold' : 'text-gray-600'}`} />
                ))}
              </div>
              <span className="text-gray-400 text-sm font-racing">
                ({allReviews.length > 0 ? `${avgRating.toFixed(1)} / 5.0 · ${allReviews.length} reviews` : 'No reviews yet'})
              </span>
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
                className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl text-base sm:text-lg hover:shadow-lg hover:shadow-green-500/30 transition-shadow font-racing tracking-wide"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </motion.a>
              <motion.button
                type="button"
                onClick={() => {
                  addItem(product, 1)
                  setJustAdded(true)
                  window.setTimeout(() => setJustAdded(false), 1400)
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-5 py-4 bg-bg-2 border border-line text-fg hover:text-primary hover:border-primary/40 font-bold rounded-xl transition-colors font-racing tracking-wide"
              >
                {justAdded ? (
                  <>
                    <Check className="w-5 h-5 text-primary" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => {
                  addItem(product, 1)
                  navigate('/checkout')
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-shadow animate-pulse-glow font-racing tracking-wide"
              >
                <ShoppingBag className="w-5 h-5" />
                Buy Now
              </motion.button>
            </div>
          </AnimatedSection>
        </div>

        {/* Mobile sticky purchase bar — keeps the primary actions
            within thumb reach as the user scrolls through specs and
            related items. Hidden on md+ where the inline buttons
            stay visible. */}
        <div className="v-mobile-cta-bar md:hidden" aria-label="Quick purchase actions">
          <div className="v-mobile-cta-bar-inner">
            <button
              type="button"
              onClick={() => {
                addItem(product, 1)
                setJustAdded(true)
                window.setTimeout(() => setJustAdded(false), 1400)
              }}
              className="v-mobile-cta-secondary"
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-primary" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                addItem(product, 1)
                navigate('/checkout')
              }}
              className="v-mobile-cta-primary"
            >
              <ShoppingBag className="w-4 h-4" />
              Buy Now
            </button>
          </div>
        </div>

        {/* Description / Specifications / Reviews Tabs */}
        <AnimatedSection className="mt-12">
          <div className="racing-stripe-divider mb-8 rounded-full" />
          <div className="flex gap-1 sm:gap-2 mb-6 overflow-x-auto pb-1">
            {[
              { key: 'description' as const, label: 'Description', icon: FileText },
              { key: 'specifications' as const, label: 'Specifications', icon: ClipboardList },
              { key: 'reviews' as const, label: 'Reviews', icon: MessageSquare, count: allReviews.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-racing tracking-wide transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'glass text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {'count' in tab && tab.count != null && tab.count > 0 && (
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.key ? 'bg-white/20' : 'bg-primary/20 text-primary'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl glass-premium border border-white/5 p-5 sm:p-8"
            >
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white">Product Description</h3>
                  <p className="text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-white">Specifications</h3>
                  {product.specifications && product.specifications.length > 0 ? (
                    <div className="divide-y divide-white/5">
                      {product.specifications.map((spec, i) => (
                        <div key={i} className="flex items-center py-3 gap-4">
                          <span className="text-gray-400 text-sm sm:text-base w-2/5 font-racing">{spec.label}</span>
                          <span className="text-white text-sm sm:text-base w-3/5">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No specifications available yet.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-display font-bold text-white">
                      Reviews ({allReviews.length})
                    </h3>
                    {allReviews.length > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= Math.round(avgRating) ? 'fill-gold text-gold' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-400 text-sm font-racing">{avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Review List */}
                  {allReviews.length > 0 ? (
                    <div className="space-y-4">
                      {allReviews.map((review) => (
                        <div key={review.id} className="p-4 rounded-xl glass border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <span className="text-white text-sm font-semibold">{review.author}</span>
                                <span className="text-gray-500 text-xs ml-2">{review.date}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= review.rating ? 'fill-gold text-gold' : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm leading-relaxed">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No reviews yet. Be the first to review!</p>
                  )}

                  {/* Add Review Form */}
                  <div className="pt-4 border-t border-white/5">
                    <h4 className="text-white font-semibold mb-4 font-racing">Write a Review</h4>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (!reviewForm.author.trim() || !reviewForm.text.trim()) return
                        const newReview: ProductReview = {
                          id: `local-${Date.now()}`,
                          author: reviewForm.author.trim(),
                          rating: reviewForm.rating,
                          text: reviewForm.text.trim(),
                          date: new Date().toISOString().split('T')[0],
                        }
                        setLocalReviews((prev) => [newReview, ...prev])
                        setReviewForm({ author: '', rating: 5, text: '' })
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Your Name</label>
                        <input
                          type="text"
                          value={reviewForm.author}
                          onChange={(e) => setReviewForm((f) => ({ ...f, author: e.target.value }))}
                          placeholder="Enter your name"
                          className="w-full px-4 py-2.5 rounded-xl glass text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Rating</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewForm((f) => ({ ...f, rating: s }))}
                              className="p-0.5"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  s <= reviewForm.rating
                                    ? 'fill-gold text-gold'
                                    : 'text-gray-600 hover:text-gold/50'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-1 block">Your Review</label>
                        <textarea
                          value={reviewForm.text}
                          onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))}
                          placeholder="Share your experience with this product..."
                          rows={3}
                          className="w-full px-4 py-2.5 rounded-xl glass text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
                          required
                        />
                      </div>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-bold rounded-xl text-sm hover:shadow-lg hover:shadow-primary/30 transition-shadow font-racing"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Submit Review
                      </motion.button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </AnimatedSection>

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
                          loading="lazy"
                          decoding="async"
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
