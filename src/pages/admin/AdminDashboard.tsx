import { motion } from 'framer-motion'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  Settings,
  LogOut,
  Bike,
  Menu,
  X,
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { demoProducts, demoCategories } from '@/data/demo-data'

const sidebarLinks = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: Grid3X3 },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
]

function DashboardHome() {
  const stats = [
    { label: 'Total Products', value: demoProducts.length.toString(), icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10', change: '+12%' },
    { label: 'Categories', value: demoCategories.length.toString(), icon: Grid3X3, color: 'text-cyan', bg: 'bg-cyan/10', change: '+3' },
    { label: 'Total Customers', value: '2,500+', icon: Users, color: 'text-gold', bg: 'bg-gold/10', change: '+8%' },
    { label: 'Revenue', value: '৳125K', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10', change: '+15%' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Welcome back! Here&apos;s your store overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <AnimatedSection key={stat.label} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-xl glass"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-green-400 text-xs font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.3}>
        <div className="p-6 rounded-xl glass">
          <h2 className="text-lg font-bold text-white mb-4">Recent Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-white/5">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {demoProducts.slice(0, 5).map((product) => {
                  const category = demoCategories.find(c => c.id === product.category_id)
                  return (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="text-white text-sm font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-400 text-sm">{category?.name}</td>
                      <td className="py-3 text-primary text-sm font-bold">
                        ৳{(product.discount_price || product.price).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          product.in_stock ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isExactDashboard = location.pathname === '/admin'

  const handleLogout = () => {
    localStorage.removeItem('admin_demo')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-dark flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-dark-50 border-r border-white/5 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2">
            <Bike className="w-7 h-7 text-primary" />
            <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">
              SBW Admin
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                location.pathname === link.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/5 w-full transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 glass-dark border-b border-white/5 px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="text-sm text-gray-400">
              {sidebarLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}
            </div>
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-primary transition-colors"
            >
              View Store &rarr;
            </Link>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {isExactDashboard ? <DashboardHome /> : <Outlet />}
        </main>
      </div>
    </div>
  )
}
