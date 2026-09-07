import type { CSSVars } from '../../types'
import type { MouseEvent } from 'react'
import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen } from 'lucide-react'
import landingPreview from '../../assets/serviceCards/landing.png'
import laptopMockup from '../../assets/serviceCards/desktop-app.png'
import ctaLaptop from '../../assets/images/cta-laptop.webp'
import expressLaptopClock from '../../assets/images/express-laptop-clock.webp'
import iphoneStackNew from '../../assets/serviceCards/web-shop.png'
import webservicesIcons from '../../assets/serviceCards/web-service.png'
import telegramBots from '../../assets/serviceCards/telegram-bots.png'
import { motion, useScroll, useTransform } from 'framer-motion'
import { SERVICES } from '../../data/services'
import styles from './ServiceCards.module.css'

function handleCtaGlowMove(e: MouseEvent<HTMLElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])

  return isMobile
}

function Features({ items }: { items: string[] }) {
  return (
    <div className={styles.featuresBlock}>
      <span className={styles.featuresLabel}>Что входит</span>
      <div className={styles.featuresList}>
        {items.map((f: string) => (
          <span key={f} className={styles.featurePill}>
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Оформление визуальной части каждой карточки. Ключ — slug услуги из
 * src/data/services.ts, картинки и классы оставлены прежними, чтобы
 * не менять сложившийся вид страницы.
 */
const VISUALS: Record<string, { src: string; wrap: string; imgClass?: string; alt: string }> = {
  landing: {
    src: landingPreview,
    wrap: styles.visualWide,
    alt: 'Лендинг, разработанный Avora Lab',
  },
  'online-store': {
    src: iphoneStackNew,
    wrap: styles.visualNarrow,
    imgClass: styles.storeVisualImg,
    alt: 'Интернет-магазин на телефоне',
  },
  'web-service': {
    src: webservicesIcons,
    wrap: styles.visualNarrow,
    alt: 'Веб-сервис и личный кабинет',
  },
  'telegram-bot': {
    src: telegramBots,
    wrap: styles.visualMid,
    alt: 'Telegram-бот для бизнеса',
  },
  'mobile-app': {
    src: laptopMockup,
    wrap: styles.visualMid,
    alt: 'Мобильное и десктоп-приложение',
  },
  'express-development': {
    src: expressLaptopClock,
    wrap: styles.visualNarrow,
    imgClass: styles.expressImg,
    alt: 'Экспресс-разработка в сжатые сроки',
  },
}

function Visual({ slug }: { slug: string }) {
  const v = VISUALS[slug]
  if (!v) return null
  return (
    <div className={`${styles.visual} ${v.wrap}`}>
      <img
        src={v.src}
        alt={v.alt}
        loading="lazy"
        decoding="async"
        className={`${styles.visualImg} ${v.imgClass ?? ''}`}
      />
    </div>
  )
}

export default function ServiceCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile(768) // < 768px = мобилка

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div className={styles.list} ref={containerRef}>
      {SERVICES.map((service, i) => {
        const total = SERVICES.length
        const start = i / total
        const end = (i + 1) / total

        // Эти трансформации будут работать только на десктопе
        const scale = useTransform(
          scrollYProgress,
          [0, start, end, 1],
          [1, 1, 0.7, 0.7]
        )

        const opacity = useTransform(
          scrollYProgress,
          [0, start, end, 1],
          [1, 1, 0, 0]
        )

        return (
          <motion.div
            key={service.slug}
            className={styles.cardWrap}
            style={{
              top: `${100 + i}px`,
              zIndex: i + 1,
              // На мобилке не применяем scale и opacity
              ...(isMobile
                ? {}
                : {
                  scale,
                  opacity,
                }),
            }}
          >
            {/* Вся карточка — ссылка на отдельную страницу услуги. */}
            <Link
              to={`/services/${service.slug}`}
              className={styles.cardLink}
              aria-label={`Подробнее об услуге: ${service.shortTitle}`}
            >
              <article
                className={`${styles.card} ${styles[service.cardClass]}`}
                style={
                  {
                    '--text-w': `${service.textWidth}px`,
                  } as CSSVars
                }
              >
                <div className={styles.content}>
                  <div className={styles.titleBlock}>
                    <div className={styles.headRow}>
                      <h3 className={styles.title}>{service.cardTitle}</h3>
                    </div>
                    <p className={styles.desc}>{service.cardDesc}</p>
                  </div>

                  <Features items={service.includes} />

                  <span className={styles.priceText}>{service.cardPrice}</span>

                  <span className={styles.cardActions}>
                    <span className={styles.durationBtn}>
                      <span>{service.cardDuration}</span>
                      <ArrowUpRight size={20} />
                    </span>
                    <span className={styles.detailBtn}>Подробнее об услуге</span>
                  </span>
                </div>

                <Visual slug={service.slug} />
              </article>
            </Link>

            {service.badge && (
              <span className={styles.badge}>{service.badge}</span>
            )}
          </motion.div>
        )
      })}

      {/* CTA-карточка */}
      <article
        className={`${styles.card} ${styles.cardCta}`}
        style={{
          top: `${100 + SERVICES.length * 16}px`,
          zIndex: SERVICES.length + 1,
        }}
      >
        <div className={styles.ctaBg} onMouseMove={handleCtaGlowMove}>
          <div className={styles.ctaGlow} aria-hidden="true" />
          <div className={styles.ctaContent}>
            <span className={styles.ctaEyebrow}>Готовы начать</span>
            <h2 className={styles.ctaTitle}>
              Расскажите о проекте —<br />
              остальное сделаем мы
            </h2>
            <p className={styles.ctaSubtitle}>
              Бесплатная консультация и оценка. Ответим в течение дня, предложим решение и
              сориентируем по срокам и стоимости.
            </p>
            <div className={styles.ctaRow}>
              <Link to="/contact" className={styles.ctaBtnPrimary}>
                Обсудить проект <ArrowUpRight size={24} />
              </Link>
              <Link to="/cases" className={styles.ctaBtnGlass}>
                Смотреть кейсы <BookOpen size={22} />
              </Link>
            </div>
          </div>
        </div>
        <img src={ctaLaptop} alt="" loading="lazy" className={styles.ctaLaptopLeft} />
        <img src={ctaLaptop} alt="" loading="lazy" className={styles.ctaLaptopRight} />
      </article>
    </div>
  )
}
