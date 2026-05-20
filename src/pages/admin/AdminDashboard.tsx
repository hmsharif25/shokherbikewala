import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  Settings,
  KeyRound,
  LogOut,
  Bike,
  Menu,
  X,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  MessageSquareQuote,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Phone,
  RefreshCw,
  LayoutList,
  Search,
  HelpCircle,
  PanelBottom,
  FileText,
  Rss,
  CreditCard,
} from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useStore } from '@/context/StoreContext'
import { useAuth } from '@/context/AuthContext'
import { loadRemoteInquiries } from '@/lib/db'
import { isSupabaseConfigured } from '@/lib/supabase'

const sidebarGroups = [
  {
    label: null,
    links: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Store',
    links: [
      { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
      { name: 'Products', path: '/admin/products', icon: Package },
      { name: 'Categories', path: '/admin/categories', icon: Grid3X3 },
      { name: 'Delivery & Payments', path: '/admin/delivery-payment', icon: CreditCard },
    ],
  },
  {
    label: 'Content',
    links: [
      { name: 'Hero & Content', path: '/admin/hero', icon: Sparkles },
      { name: 'Home Sections', path: '/admin/sections', icon: LayoutList },
      { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
      { name: 'Social Feed', path: '/admin/social-feed', icon: Rss },
      { name: 'FAQ', path: '/admin/faq', icon: HelpCircle },
      { name: 'Pages', path: '/admin/pages', icon: FileText },
    ],
  },
  {
    label: 'Settings',
    links: [
      { name: 'SEO Settings', path: '/admin/seo', icon: Search },
      { name: 'Footer', path: '/admin/footer', icon: PanelBottom },
      { name: 'Brand Settings', path: '/admin/settings', icon: Settings },
      { name: 'Change Password', path: '/admin/change-password', icon: KeyRound },
    ],
  },
]

const allSidebarLinks = sidebarGroups.flatMap((g) => g.links)

const statusMeta: Record<
  'new' | 'contacted' | 'completed' | 'cancelled',
  { label: string; color: string; icon: typeof Clock }
> = {
  new: { label: 'New', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', icon: AlertCircle },
  contacted: { label: 'Contacted', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: Clock },
  completed: { label: 'Completed', color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: XCircle },
}

function parseAmountFromMessage(msg: string): number {
  const match = msg.match(/Total:\s*BDT\s*([0-9,]+)/i)
  if (!match) return 0
  return parseInt(match[1].replace(/,/g, ''), 10) || 0
}

function DashboardHome() {
  const { products, categories, inquiries, setInquiries } = useStore()
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)

  const refresh = async () => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    const remote = await loadRemoteInquiries()
    if (remote.length > 0) {
      setInquiries(remote)
    }
    setLastSync(new Date())
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo(() => {
    const total = inquiries.length
    const newCount = inquiries.filter((i) => i.status === 'new').length
    const completed = inquiries.filter((i) => i.status === 'completed').length
    const revenue = inquiries
      .filter((i) => i.status === 'completed')
      .reduce((sum, i) => sum + parseAmountFromMessage(i.message || ''), 0)
    return [
      {
        label: 'Total Orders',
        value: total.toString(),
        icon: ShoppingBag,
        color: 'text-primary',
        bg: 'bg-primary/10',
        sub: `${newCount} new`,
      },
      {
        label: 'Completed',
        value: completed.toString(),
        icon: CheckCircle,
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        sub: total > 0 ? `${Math.round((completed / total) * 100)}% rate` : '0% rate',
      },
      {
        label: 'Revenue',
        value: `৳${revenue.toLocaleString()}`,
        icon: DollarSign,
        color: 'text-gold',
        bg: 'bg-gold/10',
        sub: `from ${completed} order${completed === 1 ? '' : 's'}`,
      },
      {
        label: 'Catalog',
        value: products.length.toString(),
        icon: Package,
        color: 'text-cyan',
        bg: 'bg-cyan/10',
        sub: `${categories.length} categories`,
      },
    ]
  }, [inquiries, products.length, categories.length])

  const statusBreakdown = useMemo(() => {
    const buckets: Record<'new' | 'contacted' | 'completed' | 'cancelled', number> = {
      new: 0,
      contacted: 0,
      completed: 0,
      cancelled: 0,
    }
    inquiries.forEach((i) => {
      buckets[i.status] = (buckets[i.status] || 0) + 1
    })
    const max = Math.max(1, ...Object.values(buckets))
    return Object.entries(buckets).map(([key, count]) => ({
      key: key as 'new' | 'contacted' | 'completed' | 'cancelled',
      count,
      pct: Math.round((count / max) * 100),
    }))
  }, [inquiries])

  const topProducts = useMemo(() => {
    const counts = new Map<string, number>()
    inquiries.forEach((i) => {
      const base = (i.product_name || 'Unknown').split(' × ')[0].trim()
      counts.set(base, (counts.get(base) || 0) + 1)
    })
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [inquiries])

  const recentInquiries = inquiries.slice(0, 6)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Dashboard</h1>
          <p className="text-fg-muted text-sm">
            Welcome back! Here&apos;s your store overview.
            {lastSync && (
              <span className="ml-2 text-xs text-fg-soft">
                • Synced {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => void refresh()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-racing tracking-wide hover:bg-primary/15 transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Syncing…' : 'Refresh'}
        </button>
      </div>

      {!isSupabaseConfigured() && (
        <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-gold text-sm font-racing">
          Demo mode — set <code className="px-1">VITE_SUPABASE_ANON_KEY</code> to track real data.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <AnimatedSection key={stat.label} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -3 }}
              className="p-5 rounded-xl glass border border-line"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span className="text-fg-soft text-[11px] font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.sub}
                </span>
              </div>
              <div className="text-2xl font-display font-bold text-fg mb-0.5">{stat.value}</div>
              <div className="text-fg-muted text-sm">{stat.label}</div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AnimatedSection delay={0.2} className="lg:col-span-2">
          <div className="p-5 rounded-xl glass border border-line h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-fg">Recent Orders</h2>
              <Link
                to="/admin/orders"
                className="text-primary text-xs hover:underline inline-flex items-center gap-1 font-racing"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            {recentInquiries.length === 0 ? (
              <div className="py-10 text-center text-fg-soft text-sm">No orders yet</div>
            ) : (
              <div className="space-y-2">
                {recentInquiries.map((inq) => {
                  const meta = statusMeta[inq.status]
                  const Icon = meta.icon
                  return (
                    <div
                      key={inq.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-bg-2/50 border border-line/50 hover:border-primary/30 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-fg font-medium text-sm truncate">{inq.customer_name}</span>
                          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${meta.color}`}>
                            <Icon className="w-2.5 h-2.5" />
                            {meta.label}
                          </span>
                        </div>
                        <div className="text-fg-soft text-xs truncate">{inq.product_name}</div>
                      </div>
                      <a
                        href={`tel:${inq.phone}`}
                        className="p-1.5 rounded-md bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors flex-shrink-0"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="p-5 rounded-xl glass border border-line h-full">
            <h2 className="text-base font-bold text-fg mb-4">Order Status</h2>
            <div className="space-y-3">
              {statusBreakdown.map(({ key, count, pct }) => {
                const meta = statusMeta[key]
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-fg-muted text-xs font-medium capitalize">{meta.label}</span>
                      <span className="text-fg text-xs font-semibold">{count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-bg-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          key === 'new'
                            ? 'bg-blue-400'
                            : key === 'contacted'
                              ? 'bg-yellow-400'
                              : key === 'completed'
                                ? 'bg-green-400'
                                : 'bg-red-400'
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {topProducts.length > 0 && (
        <AnimatedSection delay={0.4}>
          <div className="p-5 rounded-xl glass border border-line">
            <h2 className="text-base font-bold text-fg mb-4">Top Products by Inquiries</h2>
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-bg-2/40 border border-line/50"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-fg text-sm truncate">{p.name}</span>
                  </div>
                  <span className="text-primary font-bold text-sm">{p.count}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isExactDashboard = location.pathname === '/admin'

  const { signOut, user } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-2 border-r border-line transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 border-b border-line">
          <Link to="/" className="flex items-center gap-2">
            <Bike className="w-7 h-7 text-primary" />
            <span className="font-display text-lg font-bold bg-gradient-to-r from-primary to-cyan bg-clip-text text-transparent">
              SBW Admin
            </span>
          </Link>
          {user && (
            <div className="mt-3 text-xs text-fg-soft truncate font-racing">
              {user.email}
            </div>
          )}
        </div>

        <nav className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {sidebarGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-fg-soft/60">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-primary/15 text-primary border border-primary/30'
                        : 'text-fg-muted hover:text-fg hover:bg-primary/5 border border-transparent'
                    }`}
                  >
                    <link.icon className="w-4.5 h-4.5" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-line">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-fg-muted hover:text-red-400 hover:bg-red-400/5 w-full transition-all"
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
        <header className="sticky top-0 z-30 glass-dark border-b border-line px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-fg-muted hover:text-fg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="text-sm text-fg-muted font-racing">
              {allSidebarLinks.find((l) => l.path === location.pathname)?.name || 'Dashboard'}
            </div>
            <Link
              to="/"
              className="text-sm text-fg-muted hover:text-primary transition-colors"
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
