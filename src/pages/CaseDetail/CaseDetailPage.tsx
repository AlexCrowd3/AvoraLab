import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Clock,
  Layers,
  LayoutGrid,
  ListChecks,
  ListOrdered,
  Paperclip,
} from 'lucide-react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import { CASES } from '../../data/cases'
import caseHeroWide from '../../assets/images/case-hero-wide.webp'
import caseHeroMobile from '../../assets/images/case-hero-mobile.webp'
import ctaNotifCard from '../../assets/images/cta-notif-card.webp'
import styles from './CaseDetailPage.module.css'

function handleGlowMove(e: MouseEvent<HTMLElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`)
  card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`)
}

export default function CaseDetailPage() {
  const { slug } = useParams()
  const caseItem = CASES.find((c) => c.slug === slug)

  // Картинка в блоке «Нужен похожий проект?» плавно выезжает снизу, когда
  // блок попадает в область видимости при прокрутке.
  const ctaVisualRef = useRef(null)
  const [ctaVisible, setCtaVisible] = useState(false)

  useEffect(() => {
    const el = ctaVisualRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCtaVisible(true)
      return
    }
    // Наблюдатель не отключается после первого срабатывания: когда блок
    // уходит вверх за пределы экрана, картинка так же плавно уезжает вниз.
    const observer = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { rootMargin: '0px 0px -12% 0px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [slug])

  // Плавно поднимаем страницу наверх при переходе между кейсами (например,
  // по кнопке "Следующий кейс") — иначе остался бы прежний скролл.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [slug])

  // Некорректный/устаревший slug в URL — отправляем на список кейсов, а не
  // показываем пустую страницу.
  if (!caseItem) return <Navigate to="/cases" replace />

  return (
    <>
      <Header />
      <main>
        <section className={styles.heroSection}>
          <div className="container">
            {/* Шапка кейса: слева кнопка-таблетка «Назад» и название,
                справа три таблетки — срок, стек и тип проекта. */}
            <div className={styles.heroTopBar}>
              <div className={styles.heroTopLeft}>
                <Link to="/cases" className={styles.backPill}>
                  <ArrowLeft size={16} />
                  <span>Назад</span>
                </Link>
                <h1 className={styles.heroTitle}>{caseItem.title}</h1>
              </div>

              <div className={styles.heroMeta}>
                <span className={styles.metaPill}>
                  <Clock size={20} />
                  <span>{caseItem.tags[0]}</span>
                </span>
                <span className={styles.metaPill}>
                  <Layers size={20} />
                  <span>{caseItem.tags[1]}</span>
                </span>
                <span className={styles.metaPill}>
                  <LayoutGrid size={20} />
                  <span>{caseItem.category}</span>
                </span>
              </div>
            </div>

            {/* Картинка сама и есть карточка — на узких экранах
                подставляется вертикальная версия. */}
            <picture className={styles.heroCard}>
              <source media="(max-width: 900px)" srcSet={caseHeroMobile} />
              <img src={caseHeroWide} alt={caseItem.title} className={styles.heroCardImg} />
            </picture>
          </div>
        </section>

        <section className={styles.body}>
          <div className="container">
            <h2 className={styles.sectionTitle}>О проекте</h2>

            <div className={styles.threeCol}>
              <div className={styles.infoCard}>
                <h3 className={styles.blockTitle}>
                  <ListOrdered size={22} className={styles.blockIcon} />
                  <span>Задача клиента</span>
                </h3>
                <p className={styles.blockText}>{caseItem.task}</p>
              </div>
              <div className={styles.infoCard}>
                <h3 className={styles.blockTitle}>
                  <ListChecks size={22} className={styles.blockIcon} />
                  <span>Что мы сделали</span>
                </h3>
                <p className={styles.blockText}>{caseItem.solution}</p>
              </div>
              <div className={styles.infoCard}>
                <h3 className={styles.blockTitle}>
                  <Paperclip size={22} className={styles.blockIcon} />
                  <span>Особенности</span>
                </h3>
                <ul className={styles.featureList}>
                  {caseItem.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <span className={styles.featureDot} aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <h2 className={styles.sectionTitle}>Технологии</h2>
            <div className={styles.techRow}>
              {caseItem.technologies.map((t) => (
                <span key={t} className={styles.techTag}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaCard} onMouseMove={handleGlowMove}>
              <div className={styles.ctaGlow} aria-hidden="true" />
              <div className={styles.ctaText}>
                <span className={styles.ctaEyebrow}>Вы почти на месте</span>
                <h2 className={styles.ctaTitle}>Нужен похожий проект?</h2>
                <p className={styles.ctaSubtext}>
                  Расскажите задачу — мы предложим решение, сориентируем по срокам и стоимости.
                </p>
                <div className={styles.ctaRow}>
                  <Link to="/contact" className={styles.ctaPrimary}>
                    Обсудить проект <ArrowUpRight size={20} />
                  </Link>
                  <Link to="/cases" className={styles.ctaSecondary}>
                    Смотреть другие кейсы <BookOpen size={18} />
                  </Link>
                </div>
              </div>
              <div
                className={`${styles.ctaVisual} ${ctaVisible ? styles.ctaVisualIn : ''}`}
                ref={ctaVisualRef}
                aria-hidden="true"
              >
                <img src={ctaNotifCard} alt="" className={styles.ctaVisualImg} />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
