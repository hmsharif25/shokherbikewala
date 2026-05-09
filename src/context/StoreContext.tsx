import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Product, Category, BrandSettings, Testimonial, Inquiry, HomeSections } from '@/types'
import { demoProducts, demoCategories, demoBrandSettings, demoTestimonials, demoInquiries } from '@/data/demo-data'
import { isSupabaseConfigured } from '@/lib/supabase'
import { loadRemotePublic, loadHomeSectionsRemote } from '@/lib/db'

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
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(() => {
    const stored = loadFromStorage()
    if (stored) {
      return { ...stored, homeSections: stored.homeSections ?? defaultHomeSections }
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
    Promise.all([loadRemotePublic(), loadHomeSectionsRemote()]).then(([remote, remoteSections]) => {
      if (cancelled) return
      setState((prev) => ({
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
        homeSections: remoteSections ?? prev.homeSections,
      }))
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
