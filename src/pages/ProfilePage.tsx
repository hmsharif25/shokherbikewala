import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  ShieldCheck,
  LogOut,
  PackageSearch,
  ShoppingBag,
  Compass,
  Sparkles,
  Loader2,
} from 'lucide-react'
import PageTransition from '@/components/ui/PageTransition'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

/**
 * Authenticated profile screen — replaces the "click profile, see
 * login form again" bug. Shows the logged-in user's name, email and
 * admin badge, plus shortcuts to the most-used authenticated
 * destinations (orders, cart, shop) and a sign-out action.
 *
 * Anonymous visitors are redirected to /auth so this route is
 * effectively protected on the client.
 */
export default function ProfilePage() {
  const { user, isAdmin, signOut, loading } = useAuth()
  const { totalQty: cartCount } = useCart()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth', { replace: true })
    }
  }, [loading, user, navigate])

  if (loading || !user) {
    return (
      <PageTransition className="min-h-screen flex items-center justify-center bg-bg">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </PageTransition>
    )
  }

  const displayName = user.name || user.email.split('@')[0]
  const initials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <PageTransition className="min-h-screen pt-4 sm:pt-24 pb-24 md:pb-16 bg-bg">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-fg-muted hover:text-primary transition-colors text-sm font-racing"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </AnimatedSection>

        {/* Identity card */}
        <AnimatedSection className="mb-6">
          <div className="relative overflow-hidden rounded-3xl glass border border-line p-6 sm:p-7">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-cyan/10 blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={displayName}
                  width={72}
                  height={72}
                  className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl object-cover border border-primary/30 shadow-lg shadow-primary/20"
                />
              ) : (
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/30 flex items-center justify-center text-2xl font-display font-bold text-primary shadow-lg shadow-primary/20">
                  {initials || <UserIcon className="w-7 h-7" />}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-display font-bold text-fg truncate">
                    {displayName}
                  </h1>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[10px] font-bold uppercase tracking-wider text-primary">
                      <ShieldCheck className="w-3 h-3" />
                      Admin
                    </span>
                  )}
                </div>
                <p className="inline-flex items-center gap-1.5 text-sm text-fg-muted break-all">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  {user.email}
                </p>
                <p className="mt-2 text-xs text-fg-soft font-mono truncate">
                  ID&nbsp;·&nbsp;{user.id}
                </p>
              </div>
            </div>

            {isAdmin && (
              <div className="relative mt-5 pt-5 border-t border-line">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white font-racing tracking-wide text-sm shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Open admin dashboard
                </Link>
              </div>
            )}
          </div>
        </AnimatedSection>

        {/* Quick actions */}
        <AnimatedSection delay={0.05} className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-fg-soft mb-3 px-1">
            Quick actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/track"
              className="group relative overflow-hidden rounded-2xl glass border border-line p-4 hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/25 to-primary/5 border border-primary/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <PackageSearch className="w-5 h-5 text-primary" />
              </div>
              <div className="font-headline text-sm font-bold text-fg mb-0.5">
                My orders
              </div>
              <p className="text-xs text-fg-muted leading-snug">
                Track orders by phone number
              </p>
            </Link>

            <Link
              to="/cart"
              className="group relative overflow-hidden rounded-2xl glass border border-line p-4 hover:border-primary/40 transition-colors"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/25 to-cyan/5 border border-cyan/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5 text-cyan" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </div>
              <div className="font-headline text-sm font-bold text-fg mb-0.5">
                Your cart
              </div>
              <p className="text-xs text-fg-muted leading-snug">
                {cartCount > 0
                  ? `${cartCount} item${cartCount === 1 ? '' : 's'} ready to checkout`
                  : 'Continue building your build'}
              </p>
            </Link>

            <Link
              to="/products"
              className="group relative overflow-hidden rounded-2xl glass border border-line p-4 hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-500/5 border border-amber-400/30 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
              <div className="font-headline text-sm font-bold text-fg mb-0.5">
                Browse shop
              </div>
              <p className="text-xs text-fg-muted leading-snug">
                Discover new accessories &amp; gear
              </p>
            </Link>
          </div>
        </AnimatedSection>

        {/* Account section */}
        <AnimatedSection delay={0.1}>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-fg-soft mb-3 px-1">
            Account
          </h2>
          <div className="rounded-2xl glass border border-line divide-y divide-line overflow-hidden">
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-fg-soft font-bold">
                  Signed in as
                </div>
                <div className="text-sm text-fg truncate">{user.email}</div>
              </div>
              <Sparkles className="w-4 h-4 text-primary/60 flex-shrink-0" />
            </div>

            <motion.button
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-red-500/5 transition-colors disabled:opacity-60"
            >
              <div>
                <div className="text-sm font-semibold text-red-400 font-racing tracking-wide flex items-center gap-2">
                  {signingOut ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  Sign out
                </div>
                <div className="text-xs text-fg-soft mt-0.5">
                  End this session on this device
                </div>
              </div>
            </motion.button>
          </div>
        </AnimatedSection>
      </div>
    </PageTransition>
  )
}
