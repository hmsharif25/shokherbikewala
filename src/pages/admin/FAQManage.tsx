import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, HelpCircle, GripVertical } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { FAQItem } from '@/types'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function FAQManage() {
  const { siteConfig, setSiteConfig } = useStore()
  const [items, setItems] = useState<FAQItem[]>(siteConfig.faqItems)
  const [editing, setEditing] = useState<FAQItem | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({ question: '', answer: '' })
  const [saved, setSaved] = useState(false)

  const openAdd = () => {
    setForm({ question: '', answer: '' })
    setEditing(null)
    setIsAdding(true)
  }

  const openEdit = (item: FAQItem) => {
    setForm({ question: item.question, answer: item.answer })
    setEditing(item)
    setIsAdding(true)
  }

  const handleSaveItem = () => {
    if (!form.question.trim() || !form.answer.trim()) return
    if (editing) {
      setItems(items.map((i) => (i.id === editing.id ? { ...i, ...form } : i)))
    } else {
      setItems([...items, { id: Date.now().toString(), ...form }])
    }
    setIsAdding(false)
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this FAQ item?')) {
      setItems(items.filter((i) => i.id !== id))
    }
  }

  const handleSaveAll = () => {
    setSiteConfig({ ...siteConfig, faqItems: items })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">FAQ Management</h1>
          <p className="text-fg-muted text-sm">{items.length} questions</p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan to-cyan-600 text-white font-medium rounded-xl text-sm"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </motion.button>
          <motion.button
            onClick={handleSaveAll}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              saved
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-primary text-white hover:shadow-[0_0_20px_rgba(255,106,26,0.4)]'
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Saved!' : 'Save All'}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 rounded-xl glass">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-fg">
                  {editing ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-fg-muted hover:text-fg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-fg-muted mb-1">Question</label>
                  <input
                    value={form.question}
                    onChange={(e) => setForm({ ...form, question: e.target.value })}
                    placeholder="e.g., How long does delivery take?"
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-fg-muted mb-1">Answer</label>
                  <textarea
                    value={form.answer}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                    rows={4}
                    placeholder="Detailed answer..."
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-soft border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveItem}
                  className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-white font-medium rounded-lg text-sm"
                >
                  <Save className="w-4 h-4" />
                  {editing ? 'Update' : 'Add FAQ'}
                </motion.button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 text-fg-muted hover:text-fg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {items.map((item, i) => (
          <AnimatedSection key={item.id} delay={i * 0.04}>
            <div className="p-5 rounded-xl glass border border-line">
              <div className="flex items-start gap-3">
                <div className="text-fg-soft pt-1 cursor-grab">
                  <GripVertical className="w-4 h-4" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-cyan" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-fg font-semibold text-sm mb-1">{item.question}</h3>
                  <p className="text-fg-muted text-xs line-clamp-2">{item.answer}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg hover:bg-primary/10 text-fg-soft hover:text-primary transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-fg-soft hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  )
}
