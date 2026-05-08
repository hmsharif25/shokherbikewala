export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  discount_price: number | null
  category_id: string
  images: string[]
  featured: boolean
  in_stock: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url: string
  created_at: string
}

export interface BrandSettings {
  id: string
  brand_name: string
  tagline: string
  logo_url: string
  hero_image_url: string
  whatsapp: string
  facebook: string
  tiktok: string
  instagram: string
}

export interface Testimonial {
  id: number
  name: string
  rating: number
  text: string
  product: string
}

export interface Inquiry {
  id: number
  customer_name: string
  phone: string
  product_name: string
  message: string
  status: 'new' | 'contacted' | 'completed' | 'cancelled'
  created_at: string
}
