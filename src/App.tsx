import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import HomePage from '@/pages/HomePage'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CategoriesPage from '@/pages/CategoriesPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import AuthPage from '@/pages/AuthPage'
import AdminLoginPage from '@/pages/admin/LoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import ProductsManage from '@/pages/admin/ProductsManage'
import CategoriesManage from '@/pages/admin/CategoriesManage'
import BrandSettings from '@/pages/admin/BrandSettings'
import TestimonialsManage from '@/pages/admin/TestimonialsManage'
import HeroManage from '@/pages/admin/HeroManage'
import OrdersManage from '@/pages/admin/OrdersManage'
import PageLoader from '@/components/ui/PageLoader'
import GamingBackdrop from '@/components/ui/GamingBackdrop'
import { StoreProvider } from '@/context/StoreContext'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { useEffect } from 'react'

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
    <>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <FloatingWhatsApp />
      <MobileBottomNav />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <Router>
            <ScrollToTop />
            <PageLoader />
            <GamingBackdrop />
            <AppRoutes />
          </Router>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

function AppRoutes() {
  return (
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
        <Route path="orders" element={<OrdersManage />} />
        <Route path="settings" element={<BrandSettings />} />
      </Route>
      <Route path="/*" element={<PublicLayout />} />
    </Routes>
  )
}

export default App
