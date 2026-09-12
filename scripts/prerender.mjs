/**
 * Пререндер статических HTML-страниц + генерация sitemap.xml.
 *
 * Зачем это нужно
 * ---------------
 * Сайт — SPA на React: без JavaScript в HTML лежит пустой <div id="root">,
 * а title и description одинаковые на всех адресах. Поисковый робот,
 * который не выполняет скрипты (а Яндекс делает это далеко не всегда),
 * увидит на всех страницах одно и то же — и продвигать отдельные
 * страницы услуг будет невозможно.
 *
 * Что делает скрипт
 * -----------------
 * После `vite build` он берёт собранный dist/index.html и раскладывает его
 * копии по адресам (dist/services/landing/index.html и т.д.), подставляя в
 * каждую:
 *   • уникальный <title> и <meta name="description">;
 *   • canonical, Open Graph и Twitter-теги;
 *   • структурированные данные schema.org;
 *   • текстовый слепок страницы в <noscript> — заголовки, списки и ссылки,
 *     чтобы роботу было что прочитать без JavaScript.
 *
 * На хостинге такие файлы отдаются раньше, чем срабатывает правило
 * `/* -> /index.html`, поэтому SPA-навигация продолжает работать как была.
 *
 * Запуск: `npm run build` (скрипт вызывается автоматически).
 */

import { build } from 'esbuild'
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DIST = join(ROOT, 'dist')
const TMP = join(ROOT, 'node_modules', '.prerender')

export const SITE_URL = 'https://avoralab.ru'

/* ------------------------------------------------------------------ */
/*  Данные берём из тех же файлов, что и приложение, — без дублей.      */
/* ------------------------------------------------------------------ */

/** Импорты картинок в данных Node не понимает — подменяем их на строку с путём. */
const assetStubPlugin = {
  name: 'asset-stub',
  setup(b) {
    b.onResolve({ filter: /\.(png|jpe?g|webp|svg|gif|avif)$/ }, (args) => ({
      path: args.path,
      namespace: 'asset-stub',
    }))
    b.onLoad({ filter: /.*/, namespace: 'asset-stub' }, (args) => ({
      contents: `export default ${JSON.stringify(args.path)}`,
      loader: 'js',
    }))
  },
}

async function loadModule(entry, outName) {
  const outfile = join(TMP, outName)
  await build({
    entryPoints: [join(ROOT, entry)],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    plugins: [assetStubPlugin],
    logLevel: 'silent',
  })
  return import(`${pathToFileURL(outfile).href}?t=${Date.now()}`)
}

/* ------------------------------------------------------------------ */
/*  Вспомогательные функции                                            */
/* ------------------------------------------------------------------ */

const escapeHtml = (str = '') =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const ld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`

const list = (items) => `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`

/** Единый подвал текстового слепка: ссылки на все ключевые разделы. */
function navFallback(services) {
  const links = [
    ['/', 'Главная'],
    ['/services', 'Все услуги'],
    ['/cases', 'Кейсы'],
    ['/careers', 'Вакансии'],
    ['/contact', 'Контакты'],
    ['/privacy', 'Политика конфиденциальности'],
    ...services.map((s) => [`/services/${s.slug}`, s.shortTitle]),
  ]
  return `<nav><ul>${links
    .map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`)
    .join('')}</ul></nav>`
}

/* ------------------------------------------------------------------ */
/*  Описание маршрутов                                                 */
/* ------------------------------------------------------------------ */

function buildRoutes(SERVICES, CASES) {
  const org = {
    '@type': 'Organization',
    name: 'Avora Lab',
    url: SITE_URL,
    email: 'avoralab86@gmail.com',
    telephone: '+7 (931) 979-27-64',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Санкт-Петербург',
      addressCountry: 'RU',
    },
  }

  const crumbs = (items) => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  })

  const routes = [
    {
      path: '/',
      title: 'Avora Lab — разработка сайтов, интернет-магазинов и приложений',
      description:
        'Студия разработки полного цикла: лендинги от 24 900 ₽, интернет-магазины, веб-сервисы, Telegram-боты и мобильные приложения. Работаем по договору, с фиксированными сроками.',
      priority: '1.0',
      changefreq: 'weekly',
      jsonLd: [
        { '@context': 'https://schema.org', ...org },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Avora Lab',
          url: SITE_URL,
          inLanguage: 'ru-RU',
        },
      ],
      body: `
        <h1>Avora Lab — разработка сайтов, сервисов и приложений</h1>
        <p>Веб-студия полного цикла. Разрабатываем лендинги, интернет-магазины, веб-сервисы и личные кабинеты, Telegram-ботов и мобильные приложения. Работаем по договору, фиксируем сроки и стоимость.</p>
        <h2>Что мы разрабатываем</h2>
        ${list(SERVICES.map((s) => `${s.shortTitle} — ${s.price ?? 'индивидуальный расчёт'}, срок ${s.duration}`))}
      `,
    },
    {
      path: '/services',
      title: 'Услуги: разработка сайтов, приложений и Telegram-ботов | Avora Lab',
      description:
        'Услуги студии Avora Lab: лендинги, интернет-магазины, веб-сервисы и личные кабинеты, Telegram-боты, мобильные приложения. Сроки, стоимость и состав работ по каждой услуге.',
      priority: '0.9',
      changefreq: 'weekly',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Услуги Avora Lab',
          itemListElement: SERVICES.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.shortTitle,
            url: `${SITE_URL}/services/${s.slug}`,
          })),
        },
        crumbs([
          { name: 'Главная', path: '/' },
          { name: 'Услуги', path: '/services' },
        ]),
      ],
      body: `
        <h1>Наши услуги</h1>
        <p>Разрабатываем цифровые продукты под ключ — от лендингов до сложных сервисов и приложений.</p>
        <h2>Выберите услугу</h2>
        <ul>${SERVICES.map(
          (s) =>
            `<li><a href="/services/${s.slug}">${escapeHtml(s.shortTitle)}</a> — ${escapeHtml(
              s.price ?? 'индивидуальный расчёт'
            )}, срок ${escapeHtml(s.duration)}</li>`
        ).join('')}</ul>
      `,
    },
    {
      path: '/cases',
      title: 'Кейсы Avora Lab — примеры сайтов, приложений и ботов',
      description:
        'Портфолио студии Avora Lab: лендинги, мобильные приложения и сервисы. Задача клиента, решение, сроки и технологии по каждому проекту.',
      priority: '0.8',
      changefreq: 'monthly',
      jsonLd: [
        crumbs([
          { name: 'Главная', path: '/' },
          { name: 'Кейсы', path: '/cases' },
        ]),
      ],
      body: `
        <h1>Кейсы Avora Lab</h1>
        <ul>${CASES.map(
          (c) =>
            `<li><a href="/cases/${c.slug}">${escapeHtml(c.title)}</a> — ${escapeHtml(c.category)}</li>`
        ).join('')}</ul>
      `,
    },
    {
      path: '/careers',
      title: 'Вакансии Avora Lab — работа в студии разработки',
      description:
        'Открытые вакансии Avora Lab: разработка, дизайн и управление проектами. Условия работы и как откликнуться.',
      priority: '0.5',
      changefreq: 'monthly',
      body: '<h1>Вакансии Avora Lab</h1><p>Открытые позиции в студии разработки Avora Lab.</p>',
    },
    {
      path: '/contact',
      title: 'Контакты Avora Lab — оставить заявку на разработку',
      description:
        'Свяжитесь с Avora Lab: телефон, почта и Telegram. Оставьте заявку — обсудим задачу, предложим решение и сориентируем по срокам и стоимости.',
      priority: '0.7',
      changefreq: 'monthly',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          url: `${SITE_URL}/contact`,
          mainEntity: org,
        },
        crumbs([
          { name: 'Главная', path: '/' },
          { name: 'Контакты', path: '/contact' },
        ]),
      ],
      body: `
        <h1>Обсудим ваш проект?</h1>
        <p>Телефон: +7 (931) 979-27-64. Почта: avoralab86@gmail.com. Telegram: @RAFF_LEMs. Санкт-Петербург.</p>
      `,
    },
    {
      path: '/privacy',
      title: 'Политика конфиденциальности | Avora Lab',
      description:
        'Политика обработки персональных данных Avora Lab: какие данные мы собираем через формы сайта, зачем они нужны и как их удалить.',
      noindex: true,
      body: '<h1>Политика конфиденциальности</h1>',
    },
    {
      path: '/thanks',
      title: 'Заявка отправлена — Avora Lab',
      description: 'Спасибо за заявку. Мы свяжемся с вами в ближайшее время.',
      noindex: true,
      body: '<h1>Спасибо за заявку!</h1>',
    },
  ]

  // ---- Страницы услуг ----
  for (const s of SERVICES) {
    const path = `/services/${s.slug}`
    routes.push({
      path,
      title: s.seoTitle,
      description: s.seoDescription,
      priority: '0.9',
      changefreq: 'monthly',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: s.h1,
          serviceType: s.shortTitle,
          description: s.seoDescription,
          url: `${SITE_URL}${path}`,
          areaServed: { '@type': 'Country', name: 'Россия' },
          provider: org,
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `Что входит: ${s.shortTitle}`,
            itemListElement: s.includes.map((item) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: item },
            })),
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: s.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
        crumbs([
          { name: 'Главная', path: '/' },
          { name: 'Услуги', path: '/services' },
          { name: s.shortTitle, path },
        ]),
      ],
      body: `
        <h1>${escapeHtml(s.h1)}</h1>
        <p>${escapeHtml(s.lead)}</p>
        <h2>Что это за услуга</h2>
        ${s.about.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
        <h2>Кому подходит</h2>${list(s.forWhom)}
        <h2>Что входит в разработку</h2>${list(s.includes)}
        <h2>Что вы получите в результате</h2>${list(s.results)}
        <h2>Этапы работы</h2>
        <ol>${s.stages
          .map((st) => `<li><strong>${escapeHtml(st.title)}</strong> — ${escapeHtml(st.text)}</li>`)
          .join('')}</ol>
        <h2>Сроки и стоимость</h2>
        <p>Срок: ${escapeHtml(s.duration)}. Стоимость: ${escapeHtml(
          s.price ?? 'рассчитывается индивидуально'
        )}.</p>
        <p>${escapeHtml(s.priceNote)}</p>
        <h3>Что влияет на итоговую цену</h3>${list(s.priceFactors)}
        <h2>Частые вопросы</h2>
        <dl>${s.faq
          .map((f) => `<dt>${escapeHtml(f.q)}</dt><dd>${escapeHtml(f.a)}</dd>`)
          .join('')}</dl>
        <h2>Смежные услуги</h2>
        <ul>${s.related
          .map((r) => {
            const rel = SERVICES.find((x) => x.slug === r)
            return rel
              ? `<li><a href="/services/${rel.slug}">${escapeHtml(rel.shortTitle)}</a></li>`
              : ''
          })
          .join('')}</ul>
        <p><a href="/services">Вернуться ко всем услугам</a></p>
      `,
    })
  }

  // ---- Страницы кейсов ----
  for (const c of CASES) {
    routes.push({
      path: `/cases/${c.slug}`,
      title: `${c.title} — кейс Avora Lab`,
      description: c.desc.slice(0, 300),
      priority: '0.7',
      changefreq: 'monthly',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: c.title,
          description: c.desc,
          url: `${SITE_URL}/cases/${c.slug}`,
          creator: { '@type': 'Organization', name: 'Avora Lab', url: SITE_URL },
        },
      ],
      body: `
        <h1>${escapeHtml(c.title)}</h1>
        <p>${escapeHtml(c.desc)}</p>
        <h2>Задача клиента</h2><p>${escapeHtml(c.task)}</p>
        <h2>Что мы сделали</h2><p>${escapeHtml(c.solution)}</p>
        <h2>Особенности</h2>${list(c.features)}
        <h2>Технологии</h2>${list(c.technologies)}
      `,
    })
  }

  return routes
}

/* ------------------------------------------------------------------ */
/*  Сборка HTML одной страницы                                         */
/* ------------------------------------------------------------------ */

function renderPage(template, route, services) {
  const url = `${SITE_URL}${route.path}`
  let html = template

  // Уникальный <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(route.title)}</title>`)

  // Уникальный description
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?\/?>/,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  )

  // robots
  html = html.replace(
    /<meta\s+name="robots"[\s\S]*?\/?>/,
    `<meta name="robots" content="${route.noindex ? 'noindex, follow' : 'index, follow'}" />`
  )

  // Open Graph и Twitter
  const replaceMeta = (attr, key, value) => {
    const re = new RegExp(`<meta\\s+${attr}="${key}"[\\s\\S]*?/?>`)
    const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`
    html = re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n</head>`)
  }
  replaceMeta('property', 'og:title', route.title)
  replaceMeta('property', 'og:description', route.description)
  replaceMeta('property', 'og:url', url)
  replaceMeta('name', 'twitter:title', route.title)
  replaceMeta('name', 'twitter:description', route.description)

  // canonical
  const canonical = `<link rel="canonical" href="${url}" />`
  html = /<link\s+rel="canonical"[\s\S]*?\/?>/.test(html)
    ? html.replace(/<link\s+rel="canonical"[\s\S]*?\/?>/, canonical)
    : html.replace('</head>', `  ${canonical}\n</head>`)

  // Структурированные данные
  if (route.jsonLd?.length) {
    html = html.replace('</head>', `  ${route.jsonLd.map(ld).join('\n  ')}\n</head>`)
  }

  // Текстовый слепок для роботов без JavaScript.
  const fallback = `<noscript><div class="seo-fallback">${route.body}${navFallback(
    services
  )}</div></noscript>`
  html = html.replace('<div id="root"></div>', `${fallback}\n  <div id="root"></div>`)

  return html
}

/* ------------------------------------------------------------------ */
/*  sitemap.xml                                                        */
/* ------------------------------------------------------------------ */

function renderSitemap(routes) {
  const today = new Date().toISOString().slice(0, 10)
  const urls = routes
    .filter((r) => !r.noindex)
    .map(
      (r) => `  <url>
    <loc>${SITE_URL}${r.path === '/' ? '/' : r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq ?? 'monthly'}</changefreq>
    <priority>${r.priority ?? '0.6'}</priority>
  </url>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

/* ------------------------------------------------------------------ */
/*  Точка входа                                                        */
/* ------------------------------------------------------------------ */

async function main() {
  await mkdir(TMP, { recursive: true })

  const { SERVICES } = await loadModule('src/data/services.ts', 'services.mjs')
  const { CASES } = await loadModule('src/data/cases.ts', 'cases.mjs')

  const template = await readFile(join(DIST, 'index.html'), 'utf8')
  const routes = buildRoutes(SERVICES, CASES)

  for (const route of routes) {
    const html = renderPage(template, route, SERVICES)
    const outDir = route.path === '/' ? DIST : join(DIST, route.path)
    await mkdir(outDir, { recursive: true })
    await writeFile(join(outDir, 'index.html'), html, 'utf8')
  }

  await writeFile(join(DIST, 'sitemap.xml'), renderSitemap(routes), 'utf8')

  await rm(TMP, { recursive: true, force: true })

  console.log(
    `[prerender] Сгенерировано страниц: ${routes.length}; sitemap.xml — ${
      routes.filter((r) => !r.noindex).length
    } адресов.`
  )
}

main().catch((err) => {
  console.error('[prerender] Ошибка:', err)
  process.exit(1)
})
