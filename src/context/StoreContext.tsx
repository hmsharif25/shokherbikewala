import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Product, Category, BrandSettings, Testimonial, Inquiry, HomeSections, SiteConfig, FAQItem, FooterConfig, SEOSettings, PageContent } from '@/types'
import { demoProducts, demoCategories, demoBrandSettings, demoTestimonials, demoInquiries } from '@/data/demo-data'
import { isSupabaseConfigured } from '@/lib/supabase'
import { loadRemotePublic, loadSiteConfigRemote } from '@/lib/db'

const defaultFAQItems: FAQItem[] = [
  { id: '1', question: 'How long does delivery take?', answer: 'We deliver across Bangladesh within 2\u20134 business days. For Dhaka city, same-day or next-day delivery is available on selected items. International orders typically arrive in 7\u201314 days.' },
  { id: '2', question: 'Are all products original and authentic?', answer: '100%. We source only from authorised brand distributors and verify every item before dispatch. Each premium product ships with a manufacturer warranty card and authenticity sticker.' },
  { id: '3', question: 'What payment methods do you accept?', answer: 'Cash on Delivery, bKash, Nagad, Rocket, all major credit/debit cards, and bank transfer. International riders can also pay via PayPal \u2014 just contact us on WhatsApp.' },
  { id: '4', question: 'Do you offer warranty on helmets and exhausts?', answer: 'Yes \u2014 every premium helmet ships with a 2-year manufacturer warranty, and our exhaust systems carry a 1-year warranty against defects. Full coverage details are listed on each product page.' },
  { id: '5', question: 'How do I choose the right helmet size?', answer: 'Measure the circumference of your head 1 inch above your eyebrows. Match the result to the size chart on the helmet page. Still unsure? Ping us on WhatsApp with your measurement and we\'ll recommend the right fit.' },
  { id: '6', question: 'How can I contact customer support?', answer: 'WhatsApp is fastest \u2014 we reply within minutes during business hours (10am\u201310pm BD time). You can also DM us on Instagram, Facebook, or TikTok. All links are at the bottom of the page.' },
]

const defaultFooter: FooterConfig = {
  trustBadges: [
    { title: 'Premium Quality', sub: 'Engineered for performance & safety' },
    { title: 'Free Shipping', sub: 'Free shipping on orders over \u09F35000' },
    { title: '2 Year Warranty', sub: 'Quality guaranteed with extended care' },
    { title: 'Easy Returns', sub: 'Hassle-free returns within 7 days' },
  ],
  shopLinks: [
    { name: 'Helmets', path: '/products?category=helmets' },
    { name: 'Gloves', path: '/products?category=gloves' },
    { name: 'Riding Jackets', path: '/products?category=jackets' },
    { name: 'LED Lights', path: '/products?category=led-lights' },
    { name: 'Exhaust Systems', path: '/products?category=exhaust-systems' },
    { name: 'All Accessories', path: '/products' },
  ],
  companyLinks: [
    { name: 'About Us', path: '/about' },
    { name: 'Our Story', path: '/about' },
    { name: 'Brands', path: '/categories' },
    { name: 'Blog', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ],
  supportLinks: [
    { name: 'Shipping Information', path: '/contact' },
    { name: 'Returns & Exchanges', path: '/contact' },
    { name: 'Warranty Policy', path: '/contact' },
    { name: 'FAQ', path: '/' },
    { name: 'Track Your Order', path: '/track' },
    { name: 'Size Guide', path: '/contact' },
  ],
  newsletterEnabled: true,
  copyrightText: '\u00A9 {year} Shokher Bikewala. All rights reserved.',
}

const defaultSEO: SEOSettings = {
  siteTitle: 'Shokher Bikewala | Premium Bike Accessories in Bangladesh',
  siteDescription: 'Shop premium bike accessories in Bangladesh: helmets, gloves, jackets, LED lights, phone mounts, exhaust systems, and rider gear from Shokher Bikewala.',
  siteKeywords: ['bike accessories Bangladesh', 'motorcycle accessories Bangladesh', 'helmet shop Bangladesh', 'riding gloves Bangladesh', 'bike LED lights', 'motorcycle gear Dhaka', 'Shokher Bikewala'],
  ogImage: 'https://www.shokherbikewala.com/logo-512.png',
  googleVerification: '',
  bingVerification: '',
}

const defaultPages: PageContent = {
  aboutHeading: 'We Are Shokher Bikewala',
  aboutDescription: 'Your trusted destination for premium bike accessories in Bangladesh. We bring the best quality products for every rider.',
  aboutMission: 'Shokher Bikewala started with a simple passion - making quality bike accessories accessible to every rider in Bangladesh. We understand the thrill of the ride and the importance of having the right gear.',
  aboutVision: 'From helmets to exhaust systems, from LED lights to riding gloves, we carefully curate products that meet our high standards of quality, safety, and style. Every product in our collection is tested and approved by real riders.',
  contactHeading: 'Contact Us',
  contactDescription: 'Have a question? Need help choosing the right accessory? We\'re here to help!',
  contactEmail: 'hello@shokherbikewala.com',
  contactPhone: '+880 1518 934708',
  contactAddress: 'Dhaka, Bangladesh',
  contactMapUrl: 'https://www.google.com/maps/place/Dhaka,+Bangladesh',
  contactHours: 'Mon\u2013Sat: 10am \u2013 9pm',
}

const defaultSiteConfig: SiteConfig = {
  faqItems: defaultFAQItems,
  footer: defaultFooter,
  seo: defaultSEO,
  pages: defaultPages,
}

const defaultHomeSections: HomeSections = {
  hero: { visible: true, heading: 'SHOKHER BIKEWALA', subheading: '' },
  categories: { visible: true, heading: 'GEAR UP. RIDE BETTER.', subheading: 'Premium categories curated for riders who demand the best.' },
  featuredProducts: { visible: true, heading: 'FEATURED PRODUCTS', subheading: 'Handpicked high-performance gear for riders who demand the best.' },
  brandStory: { visible: true, heading: 'ENGINEERED FOR RIDERS', subheading: 'Every product is built for real-world performance.' },
  promoBanner: { visible: true, heading: 'PREMIUM RIDING GEAR', subheading: 'UP TO 40% OFF' },
  community: { visible: true, heading: 'RIDER SOCIAL FEED', subheading: 'Follow us across platforms — join the fastest-growing rider community.' },
  testimonials: { visible: true, heading: 'WHAT RIDERS SAY', subheading: 'Real stories from the Shokher Bikewala community.' },
  faq: { visible: true, heading: 'FREQUENTLY ASKED', subheading: 'Everything you need to know before you ride.' },
}

interface StoreState {
  products: Product[]
  categories: Category[]
  brandSettings: BrandSettings
  testimonials: Testimonial[]
  inquiries: Inquiry[]
  homeSections: HomeSections
  siteConfig: SiteConfig
}

interface StoreContextType extends StoreState {
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Product) => void
  deleteProduct: (id: string) => void
  setCategories: (categories: Category[]) => void
  addCategory: (category: Category) => void
  updateCategory: (id: string, category: Category) => void
  deleteCategory: (id: string) => void
  setBrandSettings: (settings: BrandSettings) => void
  homeSections: HomeSections
  setHomeSections: (sections: HomeSections) => void
  siteConfig: SiteConfig
  setSiteConfig: (config: SiteConfig) => void
  setTestimonials: (testimonials: Testimonial[]) => void
  addTestimonial: (testimonial: Testimonial) => void
  updateTestimonial: (id: number, testimonial: Testimonial) => void
  deleteTestimonial: (id: number) => void
  setInquiries: (inquiries: Inquiry[]) => void
  addInquiry: (inquiry: Inquiry) => void
  updateInquiry: (id: number, inquiry: Inquiry) => void
  deleteInquiry: (id: number) => void
  resetAll: () => void
  remoteLoaded: boolean
}

const STORAGE_KEY = 'sbw_store'

function loadFromStorage(): StoreState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    // ignore
  }
  return null
}

function saveToStorage(state: StoreState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
}

const defaultState: StoreState = {
  products: demoProducts,
  categories: demoCategories,
  brandSettings: demoBrandSettings,
  testimonials: demoTestimonials,
  inquiries: demoInquiries,
  homeSections: defaultHomeSections,
  siteConfig: defaultSiteConfig,
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => {
    const stored = loadFromStorage()
    if (stored) {
      return {
        ...stored,
        homeSections: stored.homeSections ?? defaultHomeSections,
        siteConfig: stored.siteConfig ?? defaultSiteConfig,
      }
    }
    return defaultState
  })
  const [remoteLoaded, setRemoteLoaded] = useState(false)

  useEffect(() => {
    saveToStorage(state)
  }, [state])

  // Hydrate public data from Supabase when configured.
  useEffect(() => {
    if (!isSupabaseConfigured()) return
    let cancelled = false
    Promise.all([loadRemotePublic(), loadSiteConfigRemote()]).then(([remote, remoteSiteConfig]) => {
      if (cancelled) return
      setState((prev) => {
        const mergedPages: PageContent = {
          ...prev.siteConfig.pages,
          ...(remoteSiteConfig.pages ?? {}),
        }
        return {
          products: remote.products && remote.products.length > 0
            ? remote.products
            : prev.products,
          categories: remote.categories && remote.categories.length > 0
            ? remote.categories
            : prev.categories,
          brandSettings: remote.brandSettings ?? prev.brandSettings,
          testimonials: remote.testimonials && remote.testimonials.length > 0
            ? remote.testimonials
            : prev.testimonials,
          inquiries: prev.inquiries,
          homeSections: remoteSiteConfig.homeSections ?? prev.homeSections,
          siteConfig: {
            faqItems: remoteSiteConfig.faqItems ?? prev.siteConfig.faqItems,
            footer: remoteSiteConfig.footer ?? prev.siteConfig.footer,
            seo: remoteSiteConfig.seo ?? prev.siteConfig.seo,
            pages: mergedPages,
          },
        }
      })
      setRemoteLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const setProducts = useCallback((products: Product[]) => {
    setState(prev => ({ ...prev, products }))
  }, [])

  const addProduct = useCallback((product: Product) => {
    setState(prev => ({ ...prev, products: [product, ...prev.products] }))
  }, [])

  const updateProduct = useCallback((id: string, product: Product) => {
    setState(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? product : p),
    }))
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
    }))
  }, [])

  const setCategories = useCallback((categories: Category[]) => {
    setState(prev => ({ ...prev, categories }))
  }, [])

  const addCategory = useCallback((category: Category) => {
    setState(prev => ({ ...prev, categories: [category, ...prev.categories] }))
  }, [])

  const updateCategory = useCallback((id: string, category: Category) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(c => c.id === id ? category : c),
    }))
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id),
    }))
  }, [])

  const setBrandSettings = useCallback((brandSettings: BrandSettings) => {
    setState(prev => ({ ...prev, brandSettings }))
  }, [])

  const setHomeSections = useCallback((homeSections: HomeSections) => {
    setState(prev => ({ ...prev, homeSections }))
  }, [])

  const setSiteConfig = useCallback((siteConfig: SiteConfig) => {
    setState(prev => ({ ...prev, siteConfig }))
  }, [])

  const setTestimonials = useCallback((testimonials: Testimonial[]) => {
    setState(prev => ({ ...prev, testimonials }))
  }, [])

  const addTestimonial = useCallback((testimonial: Testimonial) => {
    setState(prev => ({ ...prev, testimonials: [testimonial, ...prev.testimonials] }))
  }, [])

  const updateTestimonial = useCallback((id: number, testimonial: Testimonial) => {
    setState(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? testimonial : t),
    }))
  }, [])

  const deleteTestimonial = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id),
    }))
  }, [])

  const setInquiries = useCallback((inquiries: Inquiry[]) => {
    setState(prev => ({ ...prev, inquiries }))
  }, [])

  const addInquiry = useCallback((inquiry: Inquiry) => {
    setState(prev => ({ ...prev, inquiries: [inquiry, ...prev.inquiries] }))
  }, [])

  const updateInquiry = useCallback((id: number, inquiry: Inquiry) => {
    setState(prev => ({
      ...prev,
      inquiries: prev.inquiries.map(i => i.id === id ? inquiry : i),
    }))
  }, [])

  const deleteInquiry = useCallback((id: number) => {
    setState(prev => ({
      ...prev,
      inquiries: prev.inquiries.filter(i => i.id !== id),
    }))
  }, [])

  const resetAll = useCallback(() => {
    setState(defaultState)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <StoreContext.Provider value={{
      ...state,
      setProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      setCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      setBrandSettings,
      setHomeSections,
      siteConfig: state.siteConfig,
      setSiteConfig,
      setTestimonials,
      addTestimonial,
      updateTestimonial,
      deleteTestimonial,
      setInquiries,
      addInquiry,
      updateInquiry,
      deleteInquiry,
      resetAll,
      remoteLoaded,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
