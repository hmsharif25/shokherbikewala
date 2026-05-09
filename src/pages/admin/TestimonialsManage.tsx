import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Star, Quote } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { Testimonial } from '@/types'

export default function TestimonialsManage() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStore()
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({ name: '', rating: '5', text: '', product: '' })

  const openAdd = () => {
    setForm({ name: '', rating: '5', text: '', product: '' })
    setEditingTestimonial(null)
    setIsAdding(true)
  }

  const openEdit = (t: Testimonial) => {
    setForm({
      name: t.name,
      rating: t.rating.toString(),
      text: t.text,
      product: t.product,
    })
    setEditingTestimonial(t)
    setIsAdding(true)
  }

  const handleSave = () => {
    const testimonial: Testimonial = {
      id: editingTestimonial?.id || Date.now(),
      name: form.name,
      rating: parseInt(form.rating) || 5,
      text: form.text,
      product: form.product,
    }

    if (editingTestimonial) {
      updateTestimonial(editingTestimonial.id, testimonial)
    } else {
      addTestimonial(testimonial)
    }
    setIsAdding(false)
    setEditingTestimonial(null)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      deleteTestimonial(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Testimonials</h1>
          <p className="text-gray-400 text-sm">{testimonials.length} customer reviews</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gold to-primary text-white font-medium rounded-xl text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </motion.button>
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
                <h2 className="text-lg font-bold text-white">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-fg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Customer Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Rafiq Ahmed"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Product Purchased</label>
                  <input
                    value={form.product}
                    onChange={e => setForm({ ...form, product: e.target.value })}
                    placeholder="e.g., Steelbird SBA-21 GT"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Rating (1-5)</label>
                  <select
                    value={form.rating}
                    onChange={e => setForm({ ...form, rating: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {[5, 4, 3, 2, 1].map(r => (
                      <option key={r} value={r} className="bg-dark-50">{r} Star{r > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">Review Text</label>
                  <textarea
                    rows={3}
                    value={form.text}
                    onChange={e => setForm({ ...form, text: e.target.value })}
                    placeholder="What did the customer say?"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gold text-dark font-medium rounded-lg text-sm"
                >
                  <Save className="w-4 h-4" />
                  {editingTestimonial ? 'Update' : 'Add Review'}
                </motion.button>
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-5 py-2.5 text-gray-400 hover:text-fg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map(t => (
          <motion.div
            key={t.id}
            layout
            whileHover={{ y: -3 }}
            className="p-5 rounded-xl glass group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${star <= t.rating ? 'fill-gold text-gold' : 'text-gray-600'}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(t)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-cyan hover:bg-cyan/10 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <Quote className="w-6 h-6 text-primary/20 mb-2" />
            <p className="text-gray-300 text-sm italic mb-3 line-clamp-3">&ldquo;{t.text}&rdquo;</p>
            <div>
              <p className="text-white font-medium text-sm">{t.name}</p>
              <p className="text-primary text-xs">Purchased: {t.product}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
