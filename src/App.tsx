import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import HomePage from '@/pages/HomePage'
import PageLoader from '@/components/ui/PageLoader'
import GamingBackdrop from '@/components/ui/GamingBackdrop'
import ScrollProgress from '@/components/ui/ScrollProgress'
import SEO from '@/components/seo/SEO'
import { StoreProvider } from '@/context/StoreContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { CartProvider } from '@/context/CartContext'

// Route-level code splitting — every non-home page is fetched
// lazily on demand. This keeps the initial JS bundle small (only
// the hero / home shell needs to ship for first paint).
const ProductsPage = lazy(() => import('@/pages/ProductsPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const CategoriesPage = lazy(() => import('@/pages/CategoriesPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const TrackOrderPage = lazy(() => import('@/pages/TrackOrderPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage'))
const AdminLoginPage = lazy(() => import('@/pages/admin/LoginPage'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const ProductsManage = lazy(() => import('@/pages/admin/ProductsManage'))
const CategoriesManage = lazy(() => import('@/pages/admin/CategoriesManage'))
const BrandSettings = lazy(() => import('@/pages/admin/BrandSettings'))
const TestimonialsManage = lazy(() => import('@/pages/admin/TestimonialsManage'))
const HeroManage = lazy(() => import('@/pages/admin/HeroManage'))
const OrdersManage = lazy(() => import('@/pages/admin/OrdersManage'))
const HomeSectionsManage = lazy(() => import('@/pages/admin/HomeSectionsManage'))
const SEOManage = lazy(() => import('@/pages/admin/SEOManage'))
const FAQManage = lazy(() => import('@/pages/admin/FAQManage'))
const FooterManage = lazy(() => import('@/pages/admin/FooterManage'))
const PagesManage = lazy(() => import('@/pages/admin/PagesManage'))

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

function PublicLayout() {
  const location = useLocation()
  return (
    <div className="v-public-site">
      <Navbar />
      <AnimatePresence mode="wait">
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/track" element={<TrackOrderPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
          <Router>
            <ScrollToTop />
            <SEO />
            <ScrollProgress />
            <PageLoader />
            <GamingBackdrop />
            <AppRoutes />
          </Router>
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        >
          <Route path="products" element={<ProductsManage />} />
          <Route path="categories" element={<CategoriesManage />} />
          <Route path="testimonials" element={<TestimonialsManage />} />
          <Route path="hero" element={<HeroManage />} />
          <Route path="sections" element={<HomeSectionsManage />} />
          <Route path="orders" element={<OrdersManage />} />
          <Route path="seo" element={<SEOManage />} />
          <Route path="faq" element={<FAQManage />} />
          <Route path="footer" element={<FooterManage />} />
          <Route path="pages" element={<PagesManage />} />
          <Route path="settings" element={<BrandSettings />} />
        </Route>
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Suspense>
  )
}

export default App
