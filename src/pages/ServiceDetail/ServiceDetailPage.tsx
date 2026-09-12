import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  HelpCircle,
  Info,
  LayoutGrid,
  ListChecks,
  ListOrdered,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import OrderForm from '../../components/OrderForm/OrderForm'
import Seo, { SITE_URL, breadcrumbsJsonLd, faqJsonLd } from '../../components/Seo/Seo'
import { SERVICES, getServiceBySlug } from '../../data/services'
import { CASES } from '../../data/cases'
import styles from './ServiceDetailPage.module.css'

/**
 * Отдельная страница услуги: /services/:slug
 *
 * Порядок блоков повторяет путь клиента, описанный в задаче:
 * что это → кому подходит → что входит → что получите → этапы → сроки →
 * стоимость → примеры работ → вопросы → форма заявки.
 *
 * Весь контент приходит из src/data/services.ts — верстка не дублируется
 * под каждую услугу, поэтому новую услугу достаточно описать данными.
 */
export default function ServiceDetailPage() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  // Неизвестный slug — возвращаем на список услуг, а не показываем пустоту.
  if (!service) return <Navigate to="/services" replace />

  const relatedServices = service.related
    .map((s) => getServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))

  const portfolio = service.caseSlugs
    .map((cs) => CASES.find((c) => c.slug === cs))
    .filter((c): c is (typeof CASES)[number] => Boolean(c))

  const path = `/services/${service.slug}`

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.h1,
    serviceType: service.shortTitle,
    description: service.seoDescription,
    url: `${SITE_URL}${path}`,
    areaServed: { '@type': 'Country', name: 'Россия' },
    provider: {
      '@type': 'Organization',
      name: 'Avora Lab',
      url: SITE_URL,
      telephone: '+7 (931) 979-27-64',
      email: 'avoralab86@gmail.com',
      address: { '@type': 'PostalAddress', addressLocality: 'Санкт-Петербург', addressCountry: 'RU' },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Что входит: ${service.shortTitle}`,
      itemListElement: service.includes.map((item) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: item },
      })),
    },
  }

  return (
    <>
      <Seo
        title={service.seoTitle}
        description={service.seoDescription}
        path={path}
        jsonLd={[
          serviceJsonLd,
          faqJsonLd(service.faq),
          breadcrumbsJsonLd([
            { name: 'Главная', path: '/' },
            { name: 'Услуги', path: '/services' },
            { name: service.shortTitle, path },
          ]),
        ]}
      />
      <Header />

      <main>
        {/* ---------- Хлебные крошки ---------- */}
        <div className={styles.breadcrumbs}>
          <nav className={`container ${styles.crumbsRow}`} aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span className={styles.crumbSep}>/</span>
            <Link to="/services">Услуги</Link>
            <span className={styles.crumbSep}>/</span>
            <span className={styles.crumbCurrent}>{service.shortTitle}</span>
          </nav>
        </div>

        {/* ---------- Шапка услуги ---------- */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroLeft}>
              <Link to="/services" className={styles.backPill}>
                <ArrowLeft size={16} />
                <span>Все услуги</span>
              </Link>

              <h1 className={styles.h1}>{service.h1}</h1>
              <p className={styles.lead}>{service.lead}</p>

              <div className={styles.metaRow}>
                <span className={styles.metaPill}>
                  <Wallet size={18} />
                  <span>Стоимость:</span> <strong>{service.price ?? 'индивидуально'}</strong>
                </span>
                <span className={styles.metaPill}>
                  <Clock size={18} />
                  <span>Срок:</span> <strong>{service.duration}</strong>
                </span>
                <span className={styles.metaPill}>
                  <Check size={18} />
                  <span>По договору</span>
                </span>
              </div>

              <div className={styles.ctaRow}>
                <a href="#order" className={styles.btnPrimary}>
                  {service.ctaLabel}
                  <ArrowUpRight size={21} />
                </a>
                <a href="#price" className={styles.btnGlass}>
                  Узнать стоимость
                  <Wallet size={19} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.body}>
          <div className="container">
            {/* ---------- Что это такое ---------- */}
            <section className={styles.section}>
              <h2 className={styles.blockTitle}>
                <Info size={26} color='var(--text-primary)' />
                Что это за услуга
              </h2>
              {service.about.map((p) => (
                <p key={p.slice(0, 40)} className={styles.blockLead}>
                  {p}
                </p>
              ))}
            </section>

            {/* ---------- Кому подходит + что входит ---------- */}
            <section className={styles.section}>
              <div className={styles.twoCol}>
                <div className={styles.panel}>
                  <h2 className={styles.panelTitle}>
                    <Target size={22} color='var(--text-primary)' />
                    Кому подходит
                  </h2>
                  <ul className={styles.list}>
                    {service.forWhom.map((item) => (
                      <li key={item} className={styles.listItem}>
                        <Check size={18} className={styles.listIcon} color='var(--text-primary)'/>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`${styles.panel} ${styles.panelDark}`}>
                  <h2 className={styles.panelTitle}>
                    <ListChecks size={22} color='var(--white)' />
                    Что входит в разработку
                  </h2>
                  <ul className={styles.list}>
                    {service.includes.map((item) => (
                      <li key={item} className={styles.listItem}>
                        <Check size={18} className={styles.listIcon} color='var(--white)' />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ---------- Что вы получите ---------- */}
            <section className={styles.section}>
              <h2 className={styles.blockTitle}>
                <Sparkles size={26} color='var(--text-primary)' />
                Что вы получите в результате
              </h2>
              <div className={styles.resultGrid}>
                {service.results.map((item, i) => (
                  <div key={item} className={styles.resultCard}>
                    <span className={styles.resultNum}>{i + 1}</span>
                    <p className={styles.resultText}>{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ---------- Этапы работы ---------- */}
            <section className={styles.section}>
              <h2 className={styles.blockTitle}>
                <ListOrdered size={26} color='var(--text-primary)' />
                Этапы работы
              </h2>
              <p className={styles.blockLead}>
                Ориентировочный срок по услуге — {service.duration}. Точная дата запуска
                фиксируется в договоре после согласования объёма работ.
              </p>
              <div className={styles.stages} style={{ marginTop: 22 }}>
                {service.stages.map((stage, i) => (
                  <article key={stage.title} className={styles.stageCard}>
                    <span className={styles.stageNum}>{String(i + 1).padStart(2, '0')}</span>
                    <h3 className={styles.stageTitle}>{stage.title}</h3>
                    <p className={styles.stageText}>{stage.text}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* ---------- Стоимость ---------- */}
            <section className={styles.section}  id="price" style={{ scrollMarginTop: 100 }}>
              <h2 className={styles.blockTitle}>
                <Wallet size={26} color='var(--text-primary)' />
                Сколько это стоит
              </h2>

              <div className={styles.priceCard}>
                <div className={styles.priceMain}>
                  <span className={styles.priceLabel}>Стоимость услуги</span>
                  <span className={styles.priceValue}>
                    {service.price ?? 'Рассчитывается индивидуально'}
                  </span>
                  <span className={styles.priceDuration}>
                    <Clock size={17} />
                    Срок {service.duration}
                  </span>
                  <p className={styles.priceNote}>{service.priceNote}</p>
                  <a href="#order" className={`${styles.btnPrimary} ${styles.priceCta}`}>
                    {service.ctaLabel}
                    <ArrowUpRight size={21} />
                  </a>
                </div>

                <div>
                  <h3 className={styles.priceFactorsTitle}>Что влияет на итоговую цену</h3>
                  <ul className={styles.list}>
                    {service.priceFactors.map((f) => (
                      <li key={f} className={styles.listItem}>
                        <Check size={18} className={styles.listIcon} color='var(--text-primary)' />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* ---------- Примеры работ ---------- */}
            {portfolio.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.blockTitle}>
                  <BookOpen size={26} color='var(--text-primary)' />
                  Примеры работ
                </h2>
                <p className={styles.blockLead}>
                  Проекты из нашего портфолио, близкие по задачам к услуге «{service.shortTitle}».
                </p>
                <div className={styles.casesGrid} style={{ marginTop: 22 }}>
                  {portfolio.map((c) => (
                    <Link key={c.slug} to={`/cases/${c.slug}`} className={styles.caseCard}>
                      <img
                        src={c.img}
                        alt={`Кейс Avora Lab: ${c.title}`}
                        className={styles.caseImg}
                        width={1105}
                        height={630}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className={styles.caseBody}>
                        <span className={styles.caseCategory}>{c.category}</span>
                        <h3 className={styles.caseTitle}>{c.title}</h3>
                        <p className={styles.caseDesc}>{c.desc}</p>
                        <span className={styles.caseLink}>
                          Смотреть кейс <ArrowRight size={16} />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ---------- FAQ ---------- */}
            <section className={styles.section}>
              <h2 className={styles.blockTitle}>
                <HelpCircle size={26} color='var(--text-primary)' />
                Частые вопросы
              </h2>
              <div className={styles.faqList}>
                {service.faq.map((item) => (
                  <details key={item.q} className={styles.faqItem}>
                    <summary className={styles.faqQ}>
                      <h3 style={{ font: 'inherit', margin: 0 }}>{item.q}</h3>
                      <ChevronDown size={20} className={styles.faqIcon} />
                    </summary>
                    <p className={styles.faqA}>{item.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* ---------- Смежные услуги (перелинковка) ---------- */}
            {relatedServices.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.blockTitle}>
                  <LayoutGrid size={26} color='var(--text-primary)' />
                  Смежные услуги
                </h2>
                <div className={styles.relatedGrid}>
                  {relatedServices.map((r) => (
                    <Link key={r.slug} to={`/services/${r.slug}`} className={styles.relatedCard}>
                      <span className={styles.relatedTitle}>
                        {r.shortTitle}
                        <ArrowUpRight size={19} />
                      </span>
                      <span className={styles.relatedDesc}>{r.lead}</span>
                      <span className={styles.relatedPrice}>
                        {r.price ?? 'Индивидуальный расчёт'} · {r.duration}
                      </span>
                    </Link>
                  ))}
                </div>

                <div className={styles.backRow}>
                  <Link to="/services" className={styles.backAll}>
                    <ArrowLeft size={18} />
                    Вернуться ко всем услугам
                  </Link>
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ---------- Форма заявки ---------- */}
        <OrderForm
          id="order"
          service={service.shortTitle}
          eyebrow="Шаг последний"
          title={`${service.ctaLabel} в Avora Lab`}
          subtitle="Оставьте контакты и пару слов о задаче. Свяжемся, уточним детали и пришлём оценку по срокам и стоимости. Консультация бесплатная."
          submitLabel="Отправить заявку"
        />
      </main>

      <Footer />
    </>
  )
}

/** Список услуг — используется генератором sitemap и статических страниц. */
export const SERVICE_PATHS = SERVICES.map((s) => `/services/${s.slug}`)
