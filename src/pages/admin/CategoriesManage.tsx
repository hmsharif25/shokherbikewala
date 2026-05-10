import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Grid3X3, Loader2 } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { Category } from '@/types'
import ImageUpload from '@/components/ui/ImageUpload'
import {
  insertCategoryRemote,
  updateCategoryRemote,
  deleteCategoryRemote,
} from '@/lib/db'

export default function CategoriesManage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', image_url: '' })

  const openAdd = () => {
    setForm({ name: '', image_url: '' })
    setEditingCategory(null)
    setIsAdding(true)
  }

  const openEdit = (cat: Category) => {
    setForm({ name: cat.name, image_url: cat.image_url })
    setEditingCategory(cat)
    setIsAdding(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Category name is required.')
      return
    }
    setError(null)
    setSaving(true)

    const slug = form.name.toLowerCase().trim().replace(/\s+/g, '-')
    const payload = {
      name: form.name.trim(),
      slug,
      image_url: form.image_url,
    }

    if (editingCategory) {
      const res = await updateCategoryRemote(editingCategory.id, payload)
      if (res.error) {
        setError(res.error)
        setSaving(false)
        return
      }
      const next: Category = res.category ?? {
        ...editingCategory,
        ...payload,
      }
      updateCategory(editingCategory.id, next)
    } else {
      const res = await insertCategoryRemote(payload)
      if (res.error) {
        setError(res.error)
        setSaving(false)
        return
      }
      const next: Category = res.category ?? {
        id: Date.now().toString(),
        ...payload,
        created_at: new Date().toISOString(),
      }
      addCategory(next)
    }

    setSaving(false)
    setIsAdding(false)
    setEditingCategory(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    const res = await deleteCategoryRemote(id)
    if (res.error) {
      setError(res.error)
      return
    }
    deleteCategory(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Categories</h1>
          <p className="text-gray-400 text-sm">{categories.length} categories in your store</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          className="flex flex-shrink-0 items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan to-cyan-600 text-white font-medium rounded-xl text-sm whitespace-nowrap shadow-lg shadow-cyan/30 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
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
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-fg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Category Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Helmets"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <ImageUpload
                  label="Category image"
                  folder="categories"
                  value={form.image_url}
                  onChange={(v) => setForm({ ...form, image_url: typeof v === 'string' ? v : v[0] || '' })}
                />
              </div>

              {error && (
                <div className="mt-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-cyan text-white font-medium rounded-lg text-sm disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving
                    ? 'Saving...'
                    : editingCategory
                      ? 'Update'
                      : 'Add Category'}
                </motion.button>
                <button
                  onClick={() => {
                    setIsAdding(false)
                    setError(null)
                  }}
                  className="px-5 py-2.5 text-gray-400 hover:text-fg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <motion.div
            key={category.id}
            layout
            whileHover={{ y: -3 }}
            className="group rounded-xl overflow-hidden glass"
          >
            <div className="relative h-36 overflow-hidden">
              {category.image_url ? (
                <img src={category.image_url} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full bg-surface flex items-center justify-center">
                  <Grid3X3 className="w-10 h-10 text-gray-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-50 via-transparent to-transparent" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="text-fg font-bold">{category.name}</h3>
                <p className="text-gray-500 text-xs">{category.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(category)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-cyan hover:bg-cyan/10 transition-all"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
