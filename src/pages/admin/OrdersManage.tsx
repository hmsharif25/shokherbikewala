import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Eye, X, Phone, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { Inquiry } from '@/types'

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: AlertCircle },
  contacted: { label: 'Contacted', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-500/10 text-green-400 border-green-500/20', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20', icon: XCircle },
}

export default function OrdersManage() {
  const { inquiries, updateInquiry, deleteInquiry } = useStore()
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter)

  const handleStatusChange = (id: number, status: Inquiry['status']) => {
    const inquiry = inquiries.find(i => i.id === id)
    if (inquiry) {
      updateInquiry(id, { ...inquiry, status })
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      deleteInquiry(id)
      setViewingInquiry(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Orders & Inquiries</h1>
          <p className="text-gray-400 text-sm">Manage customer inquiries and order requests</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'new', 'contacted', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === s
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {s} {s !== 'all' && `(${inquiries.filter(i => i.status === s).length})`}
              {s === 'all' && `(${inquiries.length})`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500">No inquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(inquiry => {
            const config = statusConfig[inquiry.status]
            const StatusIcon = config.icon
            return (
              <motion.div
                key={inquiry.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl glass border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-semibold text-sm truncate">{inquiry.customer_name}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-1 truncate">
                      <span className="text-gray-500">Product:</span> {inquiry.product_name}
                    </p>
                    <p className="text-gray-500 text-xs line-clamp-1">{inquiry.message}</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setViewingInquiry(inquiry)}
                      className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.a
                      whileTap={{ scale: 0.9 }}
                      href={`tel:${inquiry.phone}`}
                      className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all"
                    >
                      <Phone className="w-4 h-4" />
                    </motion.a>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(inquiry.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <span className="text-gray-500 text-[10px]">Status:</span>
                  {(['new', 'contacted', 'completed', 'cancelled'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(inquiry.id, s)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all capitalize ${
                        inquiry.status === s
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white/5 text-gray-500 hover:text-gray-300'
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
              className="w-full max-w-md p-6 rounded-2xl glass border border-white/10 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-lg">Inquiry Details</h2>
                <button onClick={() => setViewingInquiry(null)} className="p-1 text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Customer</p>
                  <p className="text-white font-medium">{viewingInquiry.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Phone</p>
                  <a href={`tel:${viewingInquiry.phone}`} className="text-cyan hover:underline">{viewingInquiry.phone}</a>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Product</p>
                  <p className="text-white">{viewingInquiry.product_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Message</p>
                  <p className="text-gray-300 text-sm">{viewingInquiry.message}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-0.5">Date</p>
                  <p className="text-gray-400 text-sm">{new Date(viewingInquiry.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <motion.a
                  whileTap={{ scale: 0.95 }}
                  href={`https://wa.me/${viewingInquiry.phone.replace(/[^0-9]/g, '')}?text=Hi ${viewingInquiry.customer_name}, regarding your inquiry about ${viewingInquiry.product_name}...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-sm font-medium transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </motion.a>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(viewingInquiry.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-all"
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
