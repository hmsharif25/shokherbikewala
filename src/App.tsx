import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp'
import HomePage from '@/pages/HomePage'
import ProductsPage from '@/pages/ProductsPage'
import CategoriesPage from '@/pages/CategoriesPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import AdminLoginPage from '@/pages/admin/LoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import ProductsManage from '@/pages/admin/ProductsManage'
import CategoriesManage from '@/pages/admin/CategoriesManage'
import BrandSettings from '@/pages/admin/BrandSettings'
import { useEffect } from 'react'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
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
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="products" element={<ProductsManage />} />
          <Route path="categories" element={<CategoriesManage />} />
          <Route path="settings" element={<BrandSettings />} />
        </Route>
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </Router>
  )
}

export default App
