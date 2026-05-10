import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
  MapPin,
  StickyNote,
  ShoppingBag,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { Inquiry } from '@/types'
import {
  loadRemoteInquiries,
  updateInquiryStatusRemote,
  deleteInquiryRemote,
} from '@/lib/db'
import { isSupabaseConfigured } from '@/lib/supabase'

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', icon: AlertCircle },
  contacted: { label: 'Contacted', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/30', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/30', icon: XCircle },
}

interface ParsedOrderItem {
  index: number
  name: string
  qty: number
  subtotal: string
}

interface ParsedOrder {
  items: ParsedOrderItem[]
  total: string | null
  totalQty: string | null
  email: string | null
  address: string | null
  city: string | null
  area: string | null
  notes: string | null
  /** Lines that didn't match any known prefix — show them as-is. */
  remaining: string[]
}

/**
 * Parse the structured checkout message into individual fields so we
 * can render every customer detail in its own row. The message format
 * is the one produced by `CheckoutPage.buildMessage`. We fall back to
 * just rendering the raw text if nothing matches.
 */
function parseOrderMessage(raw: string): ParsedOrder {
  const out: ParsedOrder = {
    items: [],
    total: null,
    totalQty: null,
    email: null,
    address: null,
    city: null,
    area: null,
    notes: null,
    remaining: [],
  }
  if (!raw) return out
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  // Item lines look like: "1. Helmet × 2 — ৳1,200"
  const itemRe = /^(\d+)\.\s+(.+?)\s+[×x]\s+(\d+)\s*[\u2014-]\s*(.+)$/
  const totalRe = /^Total:\s*(.+?)(?:\s*\((\d+)\s*items?\))?$/i
  for (const line of lines) {
    const im = line.match(itemRe)
    if (im) {
      out.items.push({
        index: Number(im[1]),
        name: im[2].trim(),
        qty: Number(im[3]),
        subtotal: im[4].trim(),
      })
      continue
    }
    const tm = line.match(totalRe)
    if (tm) {
      out.total = tm[1].trim()
      if (tm[2]) out.totalQty = tm[2]
      continue
    }
    if (/^Email:\s*/i.test(line)) {
      out.email = line.replace(/^Email:\s*/i, '').trim() || null
      continue
    }
    if (/^Address:\s*/i.test(line)) {
      out.address = line.replace(/^Address:\s*/i, '').trim() || null
      continue
    }
    if (/^City:\s*/i.test(line)) {
      out.city = line.replace(/^City:\s*/i, '').trim() || null
      continue
    }
    if (/^Area\s*\/?\s*Thana:?\s*/i.test(line)) {
      out.area = line.replace(/^Area\s*\/?\s*Thana:?\s*/i, '').trim() || null
      continue
    }
    if (/^Notes:\s*/i.test(line)) {
      out.notes = line.replace(/^Notes:\s*/i, '').trim() || null
      continue
    }
    // Skip section / greeting headers we already render visually.
    if (/^(Hi!|Name:|Phone:|—|\u2014)/i.test(line)) continue
    if (/^[-—\u2014\s]+Customer info[-—\u2014\s]+$/i.test(line)) continue
    out.remaining.push(line)
  }
  return out
}

export default function OrdersManage() {
  const { inquiries, setInquiries, updateInquiry, deleteInquiry } = useStore()
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const refresh = async () => {
    if (!isSupabaseConfigured()) return
    setLoading(true)
    const remote = await loadRemoteInquiries()
    if (remote.length > 0) setInquiries(remote)
    setLoading(false)
  }

  useEffect(() => {
    void refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = filter === 'all' ? inquiries : inquiries.filter((i) => i.status === filter)

  const handleStatusChange = async (id: number, status: Inquiry['status']) => {
    const inquiry = inquiries.find((i) => i.id === id)
    if (!inquiry) return
    setActionError(null)
    // Optimistic local update
    updateInquiry(id, { ...inquiry, status })
    if (viewingInquiry?.id === id) {
      setViewingInquiry({ ...inquiry, status })
    }
    if (isSupabaseConfigured()) {
      const { error } = await updateInquiryStatusRemote(id, status)
      if (error) {
        setActionError(`Status update failed: ${error}`)
        // Revert local change on error
        updateInquiry(id, inquiry)
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    const inquiry = inquiries.find((i) => i.id === id)
    setActionError(null)
    deleteInquiry(id)
    setViewingInquiry(null)
    if (isSupabaseConfigured()) {
      const { error } = await deleteInquiryRemote(id)
      if (error && inquiry) {
        setActionError(`Delete failed: ${error}`)
        // Best-effort restore
        setInquiries([inquiry, ...inquiries.filter((i) => i.id !== id)])
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Orders & Inquiries</h1>
          <p className="text-fg-muted text-sm">Manage customer inquiries and order requests</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => void refresh()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-racing tracking-wide hover:bg-primary/15 transition-all disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing' : 'Refresh'}
          </button>
        </div>
      </div>

      {actionError && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-racing">
          {actionError}
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {(['all', 'new', 'contacted', 'completed', 'cancelled'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
              filter === s
                ? 'bg-primary text-white'
                : 'bg-bg-2 text-fg-muted hover:text-fg hover:bg-primary/10 border border-line'
            }`}
          >
            {s}{' '}
            {s !== 'all' &&
              `(${inquiries.filter((i) => i.status === s).length})`}
            {s === 'all' && `(${inquiries.length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-line">
          <MessageSquare className="w-12 h-12 text-fg-soft/40 mx-auto mb-4" />
          <p className="text-fg-soft">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inquiry) => {
            const config = statusConfig[inquiry.status]
            const StatusIcon = config.icon
            return (
              <motion.div
                key={inquiry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl glass border border-line hover:border-primary/30 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-fg font-semibold text-sm truncate">{inquiry.customer_name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                      <span className="text-fg-soft text-[10px]">
                        {new Date(inquiry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-fg-muted text-xs mb-1 truncate">
                      <span className="text-fg-soft">Items:</span> {inquiry.product_name || '—'}
                    </p>
                    <p className="text-fg-soft text-xs line-clamp-1">
                      {inquiry.message?.split(/\r?\n/).find((l) => /^Address:/i.test(l)) || inquiry.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setViewingInquiry(inquiry)}
                      className="p-2 rounded-lg bg-bg-2 text-fg-muted hover:text-fg hover:bg-primary/10 transition-all border border-line"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.a
                      whileTap={{ scale: 0.9 }}
                      href={`tel:${inquiry.phone}`}
                      className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all border border-green-500/20"
                    >
                      <Phone className="w-4 h-4" />
                    </motion.a>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => void handleDelete(inquiry.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-line flex-wrap">
                  <span className="text-fg-soft text-[10px]">Status:</span>
                  {(['new', 'contacted', 'completed', 'cancelled'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => void handleStatusChange(inquiry.id, s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all capitalize ${
                        inquiry.status === s
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-bg-2 text-fg-soft hover:text-fg-muted border border-line'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {viewingInquiry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setViewingInquiry(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-2xl glass border border-line space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-fg font-bold text-lg">Inquiry Details</h2>
                <button onClick={() => setViewingInquiry(null)} className="p-1 text-fg-muted hover:text-fg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <InquiryDetails inquiry={viewingInquiry} />

              <div className="flex gap-2 pt-2">
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href={`https://wa.me/${viewingInquiry.phone.replace(/[^0-9]/g, '')}?text=Hi ${viewingInquiry.customer_name}, regarding your inquiry about ${viewingInquiry.product_name}...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-sm font-medium transition-all border border-green-500/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </motion.a>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => void handleDelete(viewingInquiry.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-all border border-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-start gap-2.5 py-1">
      <span className="mt-0.5 text-fg-soft flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-fg-soft text-[10px] uppercase tracking-wider mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            className="text-fg text-sm font-medium hover:text-primary break-words"
          >
            {value}
          </a>
        ) : (
          <p className="text-fg text-sm font-medium break-words whitespace-pre-line">{value}</p>
        )}
      </div>
    </div>
  )
}

function InquiryDetails({ inquiry }: { inquiry: Inquiry }) {
  const parsed = useMemo(() => parseOrderMessage(inquiry.message ?? ''), [inquiry.message])
  const hasStructured =
    parsed.items.length > 0 ||
    parsed.address ||
    parsed.email ||
    parsed.city ||
    parsed.area ||
    parsed.notes ||
    parsed.total

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      <div className="rounded-xl bg-surface-soft border border-line p-3 space-y-1">
        <InfoRow
          icon={<MessageSquare className="w-3.5 h-3.5" />}
          label="Customer"
          value={inquiry.customer_name}
        />
        <InfoRow
          icon={<Phone className="w-3.5 h-3.5" />}
          label="Phone"
          value={inquiry.phone}
          href={`tel:${inquiry.phone}`}
        />
        {parsed.email && (
          <InfoRow
            icon={<Mail className="w-3.5 h-3.5" />}
            label="Email"
            value={parsed.email}
            href={`mailto:${parsed.email}`}
          />
        )}
        {parsed.address && (
          <InfoRow
            icon={<MapPin className="w-3.5 h-3.5" />}
            label="Address"
            value={parsed.address}
          />
        )}
        {(parsed.city || parsed.area) && (
          <InfoRow
            icon={<MapPin className="w-3.5 h-3.5" />}
            label="City / Area"
            value={[parsed.city, parsed.area].filter(Boolean).join(' — ')}
          />
        )}
        {parsed.notes && (
          <InfoRow
            icon={<StickyNote className="w-3.5 h-3.5" />}
            label="Notes"
            value={parsed.notes}
          />
        )}
      </div>

      {parsed.items.length > 0 && (
        <div className="rounded-xl bg-surface-soft border border-line p-3 space-y-2">
          <p className="text-fg-soft text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <ShoppingBag className="w-3.5 h-3.5" />
            Items ordered
          </p>
          <ul className="space-y-1.5">
            {parsed.items.map((it) => (
              <li
                key={it.index}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="text-fg flex-1 min-w-0">
                  <span className="text-fg-soft mr-1.5">{it.index}.</span>
                  {it.name}
                  <span className="text-fg-soft ml-1.5">× {it.qty}</span>
                </span>
                <span className="text-primary font-semibold whitespace-nowrap">
                  {it.subtotal}
                </span>
              </li>
            ))}
          </ul>
          {parsed.total && (
            <div className="border-t border-line pt-2 flex items-center justify-between text-sm">
              <span className="text-fg-soft">Total</span>
              <span className="text-fg font-bold">{parsed.total}</span>
            </div>
          )}
        </div>
      )}

      {parsed.remaining.length > 0 && (
        <div>
          <p className="text-fg-soft text-[10px] uppercase tracking-wider mb-1">More</p>
          <p className="text-fg-muted text-sm whitespace-pre-line">
            {parsed.remaining.join('\n')}
          </p>
        </div>
      )}

      {!hasStructured && inquiry.message && (
        <div>
          <p className="text-fg-soft text-[10px] uppercase tracking-wider mb-1">Message</p>
          <p className="text-fg-muted text-sm whitespace-pre-line">{inquiry.message}</p>
        </div>
      )}

      <div className="text-fg-soft text-[10px] text-right">
        Submitted {new Date(inquiry.created_at).toLocaleString()}
      </div>
    </div>
  )
}
