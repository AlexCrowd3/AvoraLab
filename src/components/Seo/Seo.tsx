import { useEffect } from 'react'

/**
 * Управление мета-тегами на клиенте.
 *
 * Сайт — SPA, поэтому при переходе между страницами <head> нужно обновлять
 * вручную. Для поисковых роботов те же самые теги дополнительно
 * прописываются в статические HTML-файлы на этапе сборки
 * (scripts/prerender.mjs) — так корректный title и description видны ещё
 * до выполнения JavaScript.
 */

export const SITE_URL = 'https://avoralab.ru'
export const SITE_NAME = 'Avora Lab'

interface SeoProps {
  /** <title> страницы. Уникальный для каждой страницы. */
  title: string
  /** <meta name="description">. Уникальный для каждой страницы. */
  description: string
  /** Путь страницы, начиная со слэша: '/services/landing'. */
  path: string
  /** Абсолютный или относительный URL картинки для соцсетей. */
  image?: string
  /** Закрыть страницу от индексации (например, страницу «Спасибо»). */
  noindex?: boolean
  /** Массив объектов schema.org — попадут в <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>[]
}

/** Находит или создаёт <meta> и проставляет content. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({
  title,
  description,
  path,
  image = `${SITE_URL}/web-image.png`,
  noindex = false,
  jsonLd = [],
}: SeoProps) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`

    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
    setCanonical(url)

    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:locale', 'ru_RU')
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)

    // Структурированные данные заменяем целиком: помечаем свои блоки
    // атрибутом data-seo, чтобы не задеть разметку из index.html.
    document.head.querySelectorAll('script[data-seo="1"]').forEach((n) => n.remove())
    const nodes = jsonLd.map((obj) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.dataset.seo = '1'
      script.textContent = JSON.stringify(obj)
      document.head.appendChild(script)
      return script
    })

    return () => nodes.forEach((n) => n.remove())
  }, [title, description, path, image, noindex, JSON.stringify(jsonLd)])

  return null
}

/** Хлебные крошки в формате schema.org. */
export function breadcrumbsJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

/** Блок вопрос-ответ в формате schema.org (расширенный сниппет в выдаче). */
export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
