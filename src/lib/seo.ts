import { Category, Product } from '@/types'

export const SITE_URL = 'https://www.shokherbikewala.com'
export const SITE_NAME = 'Shokher Bikewala'
export const SITE_PHONE = '+8801518934708'
export const SITE_DESCRIPTION =
  'Shop premium bike accessories in Bangladesh: helmets, gloves, jackets, LED lights, phone mounts, exhaust systems, and rider gear from Shokher Bikewala.'
export const SITE_KEYWORDS = [
  'bike accessories Bangladesh',
  'motorcycle accessories Bangladesh',
  'helmet shop Bangladesh',
  'riding gloves Bangladesh',
  'bike LED lights',
  'motorcycle gear Dhaka',
  'Shokher Bikewala',
]

export interface SeoConfig {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  keywords?: string[]
  structuredData?: Array<Record<string, unknown>>
}

export interface RouteSeoConfig {
  title: string
  description: string
  keywords?: string[]
  noindex?: boolean
}

export const ROUTE_SEO: Record<string, RouteSeoConfig> = {
  '/': {
    title: `${SITE_NAME} | Premium Bike Accessories in Bangladesh`,
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
  },
  '/products': {
    title: `Shop Motorcycle Accessories in Bangladesh | ${SITE_NAME}`,
    description:
      'Browse helmets, gloves, jackets, LED lights, phone mounts, exhaust systems, and premium motorcycle accessories with WhatsApp ordering in Bangladesh.',
    keywords: [
      'shop motorcycle accessories',
      'bike parts Bangladesh',
      'motorcycle gear online',
      ...SITE_KEYWORDS,
    ],
  },
  '/categories': {
    title: `Bike Accessory Categories | ${SITE_NAME}`,
    description:
      'Explore premium rider categories including helmets, gloves, jackets, LED lighting, phone mounts, and exhaust systems.',
    keywords: ['bike accessory categories', 'helmet gloves jackets Bangladesh', ...SITE_KEYWORDS],
  },
  '/about': {
    title: `About ${SITE_NAME} | Premium Rider Gear Bangladesh`,
    description:
      'Learn about Shokher Bikewala, a Bangladesh motorcycle accessories brand focused on quality, safety, style, and rider community.',
    keywords: ['about Shokher Bikewala', 'motorcycle accessories brand Bangladesh', ...SITE_KEYWORDS],
  },
  '/contact': {
    title: `Contact ${SITE_NAME} | WhatsApp Bike Gear Support`,
    description:
      'Contact Shokher Bikewala by WhatsApp, Facebook, TikTok, or Instagram for motorcycle accessory advice, orders, and support.',
    keywords: ['contact bike accessories Bangladesh', 'WhatsApp motorcycle gear', ...SITE_KEYWORDS],
  },
  '/checkout': {
    title: `Checkout | ${SITE_NAME}`,
    description:
      'Confirm your Shokher Bikewala motorcycle accessory order with cash on delivery and WhatsApp support.',
    noindex: true,
  },
  '/track': {
    title: `Track Order | ${SITE_NAME}`,
    description:
      'Track your Shokher Bikewala order status using the phone number submitted during checkout.',
    noindex: true,
  },
  '/auth': {
    title: `Customer Sign In | ${SITE_NAME}`,
    description:
      'Sign in to your Shokher Bikewala customer account for motorcycle accessory orders and rider gear support.',
    noindex: true,
  },
  '/admin/login': {
    title: `Admin Login | ${SITE_NAME}`,
    description: 'Private Shokher Bikewala admin login.',
    noindex: true,
  },
}

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function absoluteImageUrl(image?: string): string {
  if (!image) return absoluteUrl('/logo-512.png')
  if (/^https?:\/\//i.test(image)) return image
  return absoluteUrl(image)
}

export function routeSeoForPath(pathname: string): RouteSeoConfig {
  if (pathname.startsWith('/products/')) {
    return ROUTE_SEO['/products']
  }
  return ROUTE_SEO[pathname] ?? ROUTE_SEO['/']
}

export function buildProductSeo(product: Product, category?: Category): SeoConfig {
  const price = product.discount_price ?? product.price
  const description = `${product.description} Buy ${product.name} from ${SITE_NAME} in Bangladesh for BDT ${price.toLocaleString()}.`

  return {
    title: `${product.name} | ${SITE_NAME}`,
    description,
    path: `/products/${product.slug}`,
    image: product.images[0],
    type: 'product',
    keywords: [
      product.name,
      category?.name ?? 'motorcycle accessory',
      'buy motorcycle accessories Bangladesh',
      ...SITE_KEYWORDS,
    ],
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo-512.png'),
    image: absoluteUrl('/logo-512.png'),
    description: SITE_DESCRIPTION,
    telephone: SITE_PHONE,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_PHONE,
        contactType: 'customer support',
        areaServed: 'BD',
        availableLanguage: ['en', 'bn'],
      },
    ],
    sameAs: [
      'https://www.facebook.com/share/1CvH4aQ5kU/?mibextid=wwXIfr',
      'https://www.tiktok.com/@shokherbikewala?_r=1&_t=ZS-964cHi86h1Q',
      'https://www.instagram.com/shokherbikewala?igsh=MWJsbW96aXphNjZsaA==',
      'https://wa.me/8801518934708',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Bangladesh',
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'BD',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 7,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn',
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/products?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function productJsonLd(product: Product, category?: Category) {
  const price = product.discount_price ?? product.price
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': absoluteUrl(`/products/${product.slug}#product`),
    name: product.name,
    description: product.description,
    image: product.images.map(absoluteImageUrl),
    category: category?.name,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: 'BDT',
      price,
      availability: product.in_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
  }
}
