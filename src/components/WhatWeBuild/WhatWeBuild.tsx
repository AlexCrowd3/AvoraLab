import type { ReactNode } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, ArrowUpRight } from 'lucide-react'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import landingPreview from '../../assets/images/landing-preview.webp'
import iphoneStackNew from '../../assets/images/iphone-stack-new.webp'
import laptopMockup from '../../assets/images/laptop-app-mockup.webp'
import webservicesIcons from '../../assets/images/webservices-icons.svg'
import telegramPills from '../../assets/images/telegram-pills.svg'
import styles from './WhatWeBuild.module.css'

function PriceButton({
  children,
  tone = 'orange',
  to = '/contact',
}: {
  children: ReactNode
  tone?: string
  /** Куда ведёт кнопка. По умолчанию — форма заявки, на карточках услуг — страница услуги. */
  to?: string
}) {
  return (
    <Link to={to} className={`${styles.priceBtn} ${styles[`tone-${tone}`]}`}>
      <span>{children}</span>
      <ArrowUpRight size={24} />
    </Link>
  )
}

/**
 * Невидимая ссылка поверх всей карточки: клик в любом месте карточки
 * открывает страницу услуги. Для скринридеров скрыта — доступная ссылка
 * находится в заголовке карточки, чтобы не дублировать один и тот же
 * пункт в списке ссылок.
 */
function CardLinkOverlay({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className={styles.cardOverlayLink}
      aria-hidden="true"
      tabIndex={-1}
      title={label}
    />
  )
}

function handleCardGlow(e: MouseEvent<HTMLElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  card.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

export default function WhatWeBuild() {
  // 6 карточек: 5 услуг + CTA "Остался один шаг" — все проявляются волной
  // снизу вверх при попадании секции в область видимости.
  const { containerRef, isVisible } = useRevealOnScroll(6)
  const revealCls = (i: number) => `reveal ${isVisible(i) ? 'reveal-visible' : ''}`

  return (
    <section className={styles.section} id="services">
      <div className="container">
        <div className="sectionEyebrow">
          <HelpCircle size={32} color="rgba(255, 255, 255, 0.8)" />
          <h2 style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 24 }}>Что мы разрабатываем?</h2>
        </div>
        <p className="sectionSubtitle" style={{ color: 'rgba(255, 255, 255, 0.6)', marginTop: 20, fontSize: 18 }}>
          Берём проект любой сложности — от лендинга до полноценной платформы. Полный цикл под
          одной крышей.
        </p>

        <div ref={containerRef}>
          <div className={styles.topRow}>
            <div className={styles.leftCol}>
              {/* Landing pages */}
              <article
                className={`${styles.card} ${styles.cardLight} ${styles.cardShort} ${revealCls(0)}`}
                onMouseMove={handleCardGlow}
              >
                <span className={styles.cardGlow} aria-hidden="true" />
                <div className={styles.cardHeadRow}>
                  <h3 className={styles.cardTitleDark}>
                    <Link to="/services/landing" className={styles.cardTitleLink}>
                      Лендинги и промо сайты
                    </Link>
                  </h3>
                  <span className={`${styles.softBadge} ${styles.badgeOrange}`}>Популярно</span>
                </div>
                <p className={styles.cardTextDark}>
                  Одностраничники, которые продают. Чистый дизайн, быстрая загрузка и акцент на
                  заявки.
                </p>
<<<<<<< HEAD
                <PriceButton tone="orange">от 24 900 ₽</PriceButton>
=======
                <PriceButton tone="orange" to="/services/landing">
                  от 24 900 ₽
                </PriceButton>
                <CardLinkOverlay to="/services/landing" label="Лендинги и промо сайты" />
>>>>>>> d2810cf (Politik konfid)
                <div className={styles.landingArt} aria-hidden="true">
                  <div className={styles.landingGlow} />
                  <img src={landingPreview} alt="" loading="lazy" />
                </div>
              </article>

              {/* Online stores */}
              <article
                className={`${styles.card} ${styles.cardPurple} ${styles.cardShort} ${revealCls(1)}`}
                onMouseMove={handleCardGlow}
              >
                <span className={styles.cardGlow} aria-hidden="true" />
                <div className={styles.cardHeadRow}>
                  <h3 className={styles.cardTitleLight}>
                    <Link to="/services/online-store" className={styles.cardTitleLink}>
                      Интернет-магазины
                    </Link>
                  </h3>
                  <span className={`${styles.softBadge} ${styles.badgeWhite}`}>Выгодно</span>
                </div>
                <p className={`${styles.cardTextLight} ${styles.storeCardText}`}>
                  Полноценные магазины с каталогом, корзиной, оплатой и личным кабинетом. Готовы к
                  запуску рекламы.
                </p>
<<<<<<< HEAD
                <PriceButton tone="white-orange">От 49 900 ₽</PriceButton>
=======
                <PriceButton tone="white-orange" to="/services/online-store">
                  От 49 900 ₽
                </PriceButton>
                <CardLinkOverlay to="/services/online-store" label="Интернет-магазины" />
>>>>>>> d2810cf (Politik konfid)
                <div className={styles.storeArt} aria-hidden="true">
                  <img src={iphoneStackNew} alt="" loading="lazy" className={styles.storeStackImg} />
                </div>
              </article>
            </div>

            <div className={styles.rightCol}>
              {/* Web services */}
              <article
                className={`${styles.card} ${styles.cardDarkGradient} ${styles.cardNarrowTall} ${revealCls(3)}`}
                onMouseMove={handleCardGlow}
              >
                <span className={styles.cardGlow} aria-hidden="true" />
                <h3 className={styles.narrowTitle2Line}>
                  <Link to="/services/web-service" className={styles.cardTitleLink}>
                    Веб сервисы и личные кабинеты
                  </Link>
                </h3>
                <p className={styles.narrowCardText}>
                  Сложные продукты: личные кабинеты, платформы, автоматизация процессов. Под ваши
                  задачи.
                </p>
<<<<<<< HEAD
                <PriceButton tone="white-dark">От 39 560 ₽</PriceButton>
=======
                <PriceButton tone="white-dark" to="/services/web-service">
                  От 39 560 ₽
                </PriceButton>
                <CardLinkOverlay to="/services/web-service" label="Веб-сервисы и личные кабинеты" />
>>>>>>> d2810cf (Politik konfid)
                <div className={styles.bubbleField} aria-hidden="true">
                  <img
                    src={webservicesIcons}
                    alt=""
                    loading="lazy"
                    className={styles.webservicesImg}
                  />
                </div>
              </article>

              {/* Telegram bots */}
              <article
                className={`${styles.card} ${styles.cardBlue} ${styles.cardNarrowTall} ${revealCls(4)}`}
                onMouseMove={handleCardGlow}
              >
                <span className={styles.cardGlow} aria-hidden="true" />
                <h3 className={styles.narrowTitle1Line}>
                  <Link to="/services/telegram-bot" className={styles.cardTitleLink}>
                    Telegram-боты
                  </Link>
                </h3>
                <p className={styles.narrowCardText}>
                  Боты для продаж, поддержки, записи и автоматизации. От простых до сложных
                  сценариев с оплатой и CRM.
                </p>
<<<<<<< HEAD
                <PriceButton tone="white-blue">От 7 990 ₽</PriceButton>
=======
                <PriceButton tone="white-blue" to="/services/telegram-bot">
                  От 7 990 ₽
                </PriceButton>
                <CardLinkOverlay to="/services/telegram-bot" label="Telegram-боты" />
>>>>>>> d2810cf (Politik konfid)
                <div className={styles.marquee} aria-hidden="true">
                  <img src={telegramPills} alt="" loading="lazy" className={styles.telegramImg} />
                </div>
              </article>
            </div>
          </div>

          <div className={styles.bottomRow}>
            {/* Mobile / desktop apps */}
            <article
              className={`${styles.card} ${styles.cardSlate} ${styles.bottomWide} ${revealCls(2)}`}
              onMouseMove={handleCardGlow}
            >
              <span className={styles.cardGlow} aria-hidden="true" />
              <div className={styles.cardHeadRow}>
                <h3 className={styles.cardTitleDark}>
                  <Link to="/services/mobile-app" className={styles.cardTitleLink}>
                    Мобильные и десктоп-приложения
                  </Link>
                </h3>
                <span className={`${styles.softBadge} ${styles.badgeDark}`}>
                  Полный цикл разработки
                </span>
              </div>
              <p className={styles.cardTextDark}>
                Нативные и кроссплатформенные приложения с удобным интерфейсом и стабильной
                работой.
              </p>
<<<<<<< HEAD
              <PriceButton tone="dark">От 78 960 ₽</PriceButton>
=======
              <PriceButton tone="dark" to="/services/mobile-app">
                От 78 960 ₽
              </PriceButton>
              <CardLinkOverlay to="/services/mobile-app" label="Мобильные и десктоп-приложения" />
>>>>>>> d2810cf (Politik konfid)
              <div className={styles.laptopArt} aria-hidden="true">
                <div className={styles.laptopGlow} />
                <img src={laptopMockup} alt="" loading="lazy" />
              </div>
            </article>

            {/* One-step CTA — deliberately compact, does not match the other
                cards' height per the client's explicit request. */}
            <article
              className={`${styles.card} ${styles.cardGlassDark} ${styles.bottomNarrow} ${revealCls(5)}`}
              onMouseMove={handleCardGlow}
            >
              <span className={styles.cardGlow} aria-hidden="true" />
              <div className={styles.oneStepInner}>
                <h3 className={styles.oneStepTitle}>Остался один шаг!</h3>
                <p className={styles.cardTextLight}>
                  Оформите заявку уже сейчас и получите полноценный рассчет вашего проекта и
                  готовый договр.
                </p>
              </div>
              <Link to="/contact" className={styles.oneStepBtn}>
                <span>Стоимость моего проекта</span>
                <ArrowUpRight size={24} />
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
