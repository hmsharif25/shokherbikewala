import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Package, Loader2 } from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { Product } from '@/types'
import ImageUpload from '@/components/ui/ImageUpload'
import { insertProductRemote, updateProductRemote, deleteProductRemote } from '@/lib/db'

export default function ProductsManage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    category_id: '',
    images: [] as string[],
    in_stock: true,
    featured: false,
  })

  const openAdd = () => {
    setForm({ name: '', description: '', price: '', discount_price: '', category_id: categories[0]?.id || '', images: [], in_stock: true, featured: false })
    setEditingProduct(null)
    setIsAdding(true)
  }

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      category_id: product.category_id,
      images: product.images,
      in_stock: product.in_stock,
      featured: product.featured,
    })
    setEditingProduct(product)
    setIsAdding(true)
  }

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Product name is required.'); return }
    if (!form.price || parseFloat(form.price) <= 0) { setError('Price must be greater than 0.'); return }
    setError(null)
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      price: parseFloat(form.price) || 0,
      discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      category_id: form.category_id,
      images: form.images.filter(Boolean),
      in_stock: form.in_stock,
      featured: form.featured,
    }

    if (editingProduct) {
      const res = await updateProductRemote(editingProduct.id, payload)
      if (res.error) { setError(res.error); setSaving(false); return }
      updateProduct(editingProduct.id, res.product ?? { ...editingProduct, ...payload })
    } else {
      const res = await insertProductRemote(payload)
      if (res.error) { setError(res.error); setSaving(false); return }
      if (res.product) {
        addProduct(res.product)
      } else {
        addProduct({ id: Date.now().toString(), ...payload, created_at: new Date().toISOString() })
      }
    }
    setSaving(false)
    setIsAdding(false)
    setEditingProduct(null)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const res = await deleteProductRemote(id)
      if (res.error) { setError(res.error); return }
      deleteProduct(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-fg mb-1">Products</h1>
          <p className="text-gray-400 text-sm">{products.length} products in your store</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-600 text-white font-medium rounded-xl text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
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
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-fg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Product Name</label>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Product name"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Category</label>
                  <select
                    value={form.category_id}
                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="bg-dark-50">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Price (৳)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Discount Price (৳, optional)</label>
                  <input
                    type="number"
                    value={form.discount_price}
                    onChange={e => setForm({ ...form, discount_price: e.target.value })}
                    placeholder="Leave empty for no discount"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-300 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Product description"
                    className="w-full px-4 py-2.5 rounded-lg bg-bg-2/80 border border-line text-fg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Product images"
                    folder="products"
                    multiple
                    value={form.images}
                    onChange={(v) => setForm({ ...form, images: Array.isArray(v) ? v : v ? [v] : [] })}
                    hint="First image is shown as the main thumbnail."
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.in_stock}
                      onChange={e => setForm({ ...form, in_stock: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-gray-300">In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={e => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/50"
                    />
                    <span className="text-sm text-gray-300">Featured</span>
                  </label>
                </div>
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-lg text-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : editingProduct ? 'Update' : 'Add Product'}
                </motion.button>
                <button
                  onClick={() => { setIsAdding(false); setError(null) }}
                  className="px-5 py-2.5 text-gray-400 hover:text-fg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-white/5">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const category = categories.find(c => c.id === product.category_id)
                return (
                  <motion.tr
                    key={product.id}
                    layout
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="text-white text-sm font-medium">{product.name}</div>
                          {product.featured && (
                            <span className="text-xs text-gold">Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-sm">{category?.name || '-'}</td>
                    <td className="px-5 py-3">
                      <div>
                        <span className="text-primary text-sm font-bold">
                          ৳{(product.discount_price || product.price).toLocaleString()}
                        </span>
                        {product.discount_price && (
                          <span className="text-gray-500 text-xs line-through ml-1">
                            ৳{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        product.in_stock ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {product.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-cyan hover:bg-cyan/10 transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
