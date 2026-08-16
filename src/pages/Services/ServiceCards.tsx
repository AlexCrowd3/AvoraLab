import type { CSSVars } from '../../types'
import type { MouseEvent } from 'react'
import { useRef } from 'react'
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
import styles from './ServiceCards.module.css'

function handleCtaGlowMove(e: MouseEvent<HTMLElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
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

function LandingVisual() {
  return (
    <div className={`${styles.visual} ${styles.visualWide}`}>
      <img src={landingPreview} alt="" loading="lazy" className={styles.visualImg} />
    </div>
  )
}

function StoreVisual() {
  return (
    <div className={`${styles.visual} ${styles.visualNarrow}`}>
      <img
        src={iphoneStackNew}
        alt=""
        loading="lazy"
        className={`${styles.visualImg} ${styles.storeVisualImg}`}
      />
    </div>
  )
}

function WebServicesVisual() {
  return (
    <div className={`${styles.visual} ${styles.visualNarrow}`}>
      <img src={webservicesIcons} alt="" loading="lazy" className={styles.visualImg} />
    </div>
  )
}

function TelegramVisual() {
  return (
    <div className={`${styles.visual} ${styles.visualMid}`}>
      <img src={telegramBots} alt="" loading="lazy" className={styles.visualImg} />
    </div>
  )
}

function MobileVisual() {
  return (
    <div className={`${styles.visual} ${styles.visualMid}`}>
      <img src={laptopMockup} alt="" loading="lazy" className={styles.visualImg} />
    </div>
  )
}

function ExpressVisual() {
  return (
    <div className={`${styles.visual} ${styles.visualNarrow}`}>
      <img src={expressLaptopClock} alt="" loading="lazy" className={styles.expressImg} />
    </div>
  )
}

const SERVICES = [
  {
    key: 'landing',
    textWidth: 667,
    title: 'Лендинги и промо сайты',
    badge: 'Популярно',
    desc: 'Одностраничные сайты, которые продают. Мы делаем не просто «красивую страницу», а инструмент для заявок и продаж.',
    features: [
      'Продающая структура',
      'Современный дизайн',
      'Адаптив под все устройства',
      'Быстрая загрузка',
      'Формы заявок и аналитика',
      'Базовая SEO-оптимизация',
    ],
    price: 'Цены начинаются от 39 900 ₽',
    duration: 'Срок от 5 дней',
    cardClass: 'cardWhite',
    Visual: LandingVisual,
  },
  {
    key: 'store',
    textWidth: 667,
    title: 'Интернет-магазины',
    badge: 'Выгодно',
    desc: 'Полноценные e-commerce решения с каталогом, корзиной, оплатой и личным кабинетом.',
    features: [
      'Каталог товаров',
      'Корзина и оформление заказа',
      'Онлайн-оплата',
      'Личный кабинет покупателя',
      'Админ-панель',
      'Интеграции с доставкой и CRM',
    ],
    price: 'Цены начинаются от 89 900 ₽',
    duration: 'Срок от 3-5 недель',
    cardClass: 'cardPurple',
    Visual: StoreVisual,
  },
  {
    key: 'webservices',
    textWidth: 764,
    title: 'Веб-сервисы и личные кабинеты',
    desc: 'Сложные продукты: платформы, личные кабинеты, внутренние системы и автоматизация процессов.',
    features: [
      'Проектирование логики',
      'Роли и доступы',
      'Личные кабинеты пользователей',
      'Административная панель',
      'Интеграции с внешними сервисами',
      'Масштабируемая архитектура',
    ],
    price: 'Цены начинаются от 79 900 ₽',
    duration: 'Срок от 4–8 недель',
    cardClass: 'cardDark',
    Visual: WebServicesVisual,
  },
  {
    key: 'telegram',
    textWidth: 667,
    title: 'Telegram-боты',
    desc: 'Боты для продаж, поддержки, записи, уведомлений и автоматизации.',
    features: [
      'Сценарии диалогов',
      'Приём заявок и заказов',
      'Оплата внутри бота',
      'Интеграция с CRM и таблицами',
      'Админ-панель',
      'Рассылки и уведомления',
    ],
    price: 'Цены начинаются От 24 900 ₽',
    duration: 'Срок от 5–14 дней',
    cardClass: 'cardBlue',
    Visual: TelegramVisual,
  },
  {
    key: 'mobile',
    textWidth: 764,
    title: 'Мобильные и десктоп-приложения',
    badge: 'Полный цикл разработки',
    desc: 'Нативные и кроссплатформенные приложения с удобным интерфейсом и стабильной работой.',
    features: [
      'UX/UI дизайн',
      'Разработка под iOS / Android / Desktop',
      'Личный кабинет',
      'Уведомления',
      'Интеграции',
      'Публикация в сторах (при необходимости)',
    ],
    price: 'Цены начинаются От 149 900 ₽',
    duration: 'Срок от 3-5 недель',
    cardClass: 'cardSlate',
    Visual: MobileVisual,
  },
  {
    key: 'express',
    textWidth: 764,
    title:
      'Мы можем сократить срок проекта до 20% от стандартного за счёт приоритетной работы команды.',
    desc: 'Вы получаете тот же качественный результат, но в ускоренном режиме. Подходит, когда нужно запуститься к рекламной кампании, акции или важному дедлайну.',
    features: [
      'Лендинг — не за 5–7 дней, а за 1–2 дня',
      'Бот — значительно быстрее обычных сроков',
      'Сервис или магазин — с максимальным приоритетом',
    ],
    price: 'Цены начинаются от +40–50% к обычной цене',
    duration: 'Обсудить экспресс-срок',
    cardClass: 'cardExpress',
    Visual: ExpressVisual,
  },
]

export default function ServiceCards() {
  const containerRef = useRef<HTMLDivElement>(null)

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
            key={service.key}
            className={styles.cardWrap}
            style={{
              top: `${100 + i}px`,
              zIndex: i + 1,
              scale,
              opacity,
            }}
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
                    <h3 className={styles.title}>{service.title}</h3>
                  </div>
                  <p className={styles.desc}>{service.desc}</p>
                </div>

                <Features items={service.features} />

                <span className={styles.priceText}>{service.price}</span>

                <Link to="/contact" className={styles.durationBtn}>
                  <span>{service.duration}</span>
                  <ArrowUpRight size={20} />
                </Link>
              </div>

              <service.Visual />
            </article>

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
              <a href="/#services" className={styles.ctaBtnGlass}>
                Смотреть кейсы <BookOpen size={22} />
              </a>
            </div>
          </div>
        </div>
        <img src={ctaLaptop} alt="" loading="lazy" className={styles.ctaLaptopLeft} />
        <img src={ctaLaptop} alt="" loading="lazy" className={styles.ctaLaptopRight} />
      </article>
    </div>
  )
}