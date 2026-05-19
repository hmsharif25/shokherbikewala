import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  absoluteImageUrl,
  absoluteUrl,
  breadcrumbJsonLd,
  buildProductSeo,
  organizationJsonLd,
  productJsonLd,
  routeSeoForPath,
  SeoConfig,
  SITE_NAME,
  websiteJsonLd,
} from '@/lib/seo'
import { useStore } from '@/context/StoreContext'

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

function removeManagedJsonLd() {
  document
    .querySelectorAll<HTMLScriptElement>('script[data-seo-json-ld="true"]')
    .forEach((script) => script.remove())
}

function appendJsonLd(data: Record<string, unknown>) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.dataset.seoJsonLd = 'true'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export default function SEO({ config }: { config?: SeoConfig }) {
  const { pathname } = useLocation()
  const { products, categories } = useStore()

  useEffect(() => {
    const slug = pathname.startsWith('/shop/')
      ? pathname.split('/').filter(Boolean)[1]
      : ''
    const product = slug ? products.find((p) => p.slug === slug) : undefined
    const category = product
      ? categories.find((c) => c.id === product.category_id)
      : undefined
    const productConfig = product
      ? {
          ...buildProductSeo(product, category),
          structuredData: [
            breadcrumbJsonLd([
              { name: 'Home', path: '/' },
              { name: 'Products', path: '/shop' },
              { name: product.name, path: `/shop/${product.slug}` },
            ]),
            productJsonLd(product, category),
          ],
        }
      : undefined
    const pageConfig = config ?? productConfig
    const routeSeo = routeSeoForPath(pathname)
    const title = pageConfig?.title ?? routeSeo.title
    const description = pageConfig?.description ?? routeSeo.description
    const image = absoluteImageUrl(pageConfig?.image)
    const canonical = absoluteUrl(pageConfig?.path ?? pathname)
    const noindex = pageConfig?.noindex ?? routeSeo.noindex ?? false
    const keywords = pageConfig?.keywords ?? routeSeo.keywords ?? []
    const type = pageConfig?.type ?? 'website'

    document.title = title
    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords.join(', ') })
    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
    })
    upsertMeta('meta[name="author"]', { name: 'author', content: SITE_NAME })
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image })
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_BD' })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image })
    upsertLink('canonical', canonical)

    removeManagedJsonLd()
    appendJsonLd(organizationJsonLd())
    appendJsonLd(websiteJsonLd())
    pageConfig?.structuredData?.forEach(appendJsonLd)
  }, [categories, config, pathname, products])

  return null
}
