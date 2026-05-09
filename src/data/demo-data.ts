import { Product, Category, BrandSettings, Testimonial, Inquiry } from '@/types'

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const demoBrandSettings: BrandSettings = {
  id: '1',
  brand_name: 'Shokher Bike Wala',
  tagline: 'Your Ultimate Bike Accessories Destination',
  logo_url: '',
  hero_image_url: '',
  whatsapp: 'https://wa.me/8801518934708',
  facebook: 'https://www.facebook.com/share/1CvH4aQ5kU/?mibextid=wwXIfr',
  tiktok: 'https://www.tiktok.com/@shokherbikewala?_r=1&_t=ZS-964cHi86h1Q',
  instagram: 'https://www.instagram.com/shokherbikewala?igsh=MWJsbW96aXphNjZsaA==',
}

export const demoCategories: Category[] = [
  {
    id: '1',
    name: 'Helmets',
    slug: 'helmets',
    image_url: img('photo-1591375372226-1cef8a93019d'),
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Gloves',
    slug: 'gloves',
    image_url: img('photo-1615484477778-ca3b77940c25'),
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Jackets',
    slug: 'jackets',
    image_url: img('photo-1551028719-00167b16eac5'),
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'LED Lights',
    slug: 'led-lights',
    image_url: img('photo-1517322048670-4fba75cbbb62'),
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Phone Mounts',
    slug: 'phone-mounts',
    image_url: img('photo-1601362840469-51e4d8d58785'),
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Exhaust Systems',
    slug: 'exhaust-systems',
    image_url: img('photo-1568772585407-9361f9bf3a87'),
    created_at: new Date().toISOString(),
  },
]

export const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Steelbird SBA-21 GT Full Face Helmet',
    slug: 'steelbird-sba-21-gt',
    description:
      'Premium full face helmet with anti-fog visor, aerodynamic design, and multi-density EPS liner for maximum safety and comfort.',
    price: 3500,
    discount_price: 2800,
    category_id: '1',
    images: [img('photo-1591375372226-1cef8a93019d')],
    featured: true,
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Riding Leather Gloves Pro',
    slug: 'riding-leather-gloves-pro',
    description:
      'Premium leather riding gloves with knuckle protection, touchscreen compatible fingertips, and reinforced palm grip.',
    price: 1200,
    discount_price: 950,
    category_id: '2',
    images: [img('photo-1615484477778-ca3b77940c25')],
    featured: true,
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Windproof Racing Jacket',
    slug: 'windproof-racing-jacket',
    description:
      'All-weather racing jacket with CE-certified armor, ventilation panels, and reflective elements for night visibility.',
    price: 5500,
    discount_price: null,
    category_id: '3',
    images: [img('photo-1551028719-00167b16eac5')],
    featured: true,
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'LED Strip Light Kit',
    slug: 'led-strip-light-kit',
    description:
      'Multi-color LED strip light kit with remote control, waterproof design, and easy installation for all bike models.',
    price: 800,
    discount_price: 650,
    category_id: '4',
    images: [img('photo-1517322048670-4fba75cbbb62')],
    featured: true,
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Universal Phone Mount X1',
    slug: 'universal-phone-mount-x1',
    description:
      'Anti-vibration phone mount with 360 rotation, fits all smartphones, and quick-release mechanism.',
    price: 600,
    discount_price: 450,
    category_id: '5',
    images: [img('photo-1601362840469-51e4d8d58785')],
    featured: false,
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Performance Exhaust Slip-On',
    slug: 'performance-exhaust-slip-on',
    description:
      'Stainless steel performance exhaust with deep rumble sound, improved airflow, and easy bolt-on installation.',
    price: 8500,
    discount_price: 7200,
    category_id: '6',
    images: [img('photo-1568772585407-9361f9bf3a87')],
    featured: true,
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Half Face Vintage Helmet',
    slug: 'half-face-vintage-helmet',
    description:
      'Retro-style half face helmet with premium finish, adjustable strap, and lightweight ABS shell.',
    price: 2200,
    discount_price: 1800,
    category_id: '1',
    images: [img('photo-1599256871681-29f55f594fe2')],
    featured: false,
    in_stock: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Mesh Summer Gloves',
    slug: 'mesh-summer-gloves',
    description:
      'Breathable mesh gloves perfect for summer riding with gel palm padding and touchscreen compatibility.',
    price: 700,
    discount_price: null,
    category_id: '2',
    images: [img('photo-1604459222860-94a936ed1c9f')],
    featured: false,
    in_stock: true,
    created_at: new Date().toISOString(),
  },
]

export const demoTestimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Rafiq Ahmed',
    rating: 5,
    text: 'Amazing quality helmet! The finish is premium and feels very safe. Delivery was super fast too. Will definitely order again from Shokher Bike Wala.',
    product: 'Steelbird SBA-21 GT',
  },
  {
    id: 2,
    name: 'Tanvir Hassan',
    rating: 5,
    text: 'Best gloves I have ever used. Perfect grip and very comfortable for long rides. The touchscreen feature works flawlessly.',
    product: 'Riding Leather Gloves Pro',
  },
  {
    id: 3,
    name: 'Kamal Hossain',
    rating: 5,
    text: 'The LED light kit completely transformed my bike! Easy to install and the colors are vibrant. Great customer service via WhatsApp.',
    product: 'LED Strip Light Kit',
  },
  {
    id: 4,
    name: 'Shakib Rahman',
    rating: 4,
    text: 'Ordered the phone mount and jacket together. Both products are excellent quality. The jacket fits perfectly and looks stylish.',
    product: 'Windproof Racing Jacket',
  },
]

export const demoInquiries: Inquiry[] = [
  {
    id: 1,
    customer_name: 'Arif Khan',
    phone: '+880 1712 345678',
    product_name: 'Steelbird SBA-21 GT Full Face Helmet',
    message: 'Is this helmet available in matte black? I want to order 2 pieces.',
    status: 'new',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    customer_name: 'Sohel Rana',
    phone: '+880 1898 765432',
    product_name: 'LED Strip Light Kit',
    message: 'Can you install this on my Yamaha R15? What is the total cost with installation?',
    status: 'contacted',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    customer_name: 'Nusrat Jahan',
    phone: '+880 1567 890123',
    product_name: 'Riding Leather Gloves Pro',
    message: 'Do you have this in size S for women? Need it urgently.',
    status: 'completed',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]
