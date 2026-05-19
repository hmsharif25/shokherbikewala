export interface ProductSpecification {
  label: string
  value: string
}

export interface ProductReview {
  id: string
  author: string
  rating: number
  text: string
  date: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description?: string
  specifications?: ProductSpecification[]
  reviews?: ProductReview[]
  price: number
  discount_price: number | null
  category_id: string
  images: string[]
  featured: boolean
  in_stock: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  created_at: string
}

export interface BrandSettings {
  id: string
  brand_name: string
  tagline: string
  logo_url: string
  hero_image_url: string
  whatsapp: string
  facebook: string
  tiktok: string
  instagram: string
}

export interface Testimonial {
  id: number
  name: string
  rating: number
  text: string
  product: string
}

export interface SectionConfig {
  visible: boolean
  heading: string
  subheading: string
}

export interface HomeSections {
  hero: SectionConfig
  categories: SectionConfig
  featuredProducts: SectionConfig
  brandStory: SectionConfig
  promoBanner: SectionConfig
  community: SectionConfig
  testimonials: SectionConfig
  faq: SectionConfig
}

export interface Inquiry {
  id: number
  customer_name: string
  phone: string
  product_name: string
  message: string
  status: 'new' | 'contacted' | 'completed' | 'cancelled'
  created_at: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface FooterConfig {
  trustBadges: Array<{ title: string; sub: string }>
  shopLinks: Array<{ name: string; path: string }>
  companyLinks: Array<{ name: string; path: string }>
  supportLinks: Array<{ name: string; path: string }>
  newsletterEnabled: boolean
  copyrightText: string
}

export interface SEOSettings {
  siteTitle: string
  siteDescription: string
  siteKeywords: string[]
  ogImage: string
  googleVerification: string
  bingVerification: string
}

export interface PageContent {
  aboutHeading: string
  aboutDescription: string
  aboutMission: string
  aboutVision: string
  contactHeading: string
  contactDescription: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
}

export interface SocialFeedPlatform {
  platform: string
  handle: string
  followers: string
}

export interface SocialFeedConfig {
  platforms: SocialFeedPlatform[]
  tiktokCoverImage: string
  youtubeTitle: string
  youtubeDescription: string
  facebookRating: string
  facebookReviewCount: string
}

export interface SiteConfig {
  faqItems: FAQItem[]
  footer: FooterConfig
  seo: SEOSettings
  pages: PageContent
}
