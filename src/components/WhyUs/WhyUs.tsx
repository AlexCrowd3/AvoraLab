import type { LucideIcon } from 'lucide-react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { HelpCircle, FastForward, Layers, FileText, Calendar, Code, BarChart3 } from 'lucide-react'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import styles from './WhyUs.module.css'

interface WhyUsCardData {
  icon: LucideIcon
  title: string
  text: string
}

const CARDS: WhyUsCardData[] = [
  {
    icon: FastForward,
    title: 'Быстрая разработка',
    text: 'Лендинг — от 5 дней. Сервис — от 3–4 недель. Без потери качества и бесконечных правок.',
  },
  {
    icon: Layers,
    title: 'Полный цикл под ключ',
    text: 'От аналитики и дизайна до разработки, тестирования и запуска. Одна команда — одна ответственность.',
  },
  {
    icon: FileText,
    title: 'Работа строго по договору',
    text: 'Фиксируем сроки, стоимость и объём работ. Никаких «ой, это будет дороже».',
  },
  {
    icon: Calendar,
    title: 'Фиксированные сроки и прозрачность',
    text: 'Вы всегда понимаете, на каком этапе проект и когда будет готов результат.',
  },
  {
    icon: Code,
    title: 'Современный дизайн и чистый код',
    text: 'Делаем так, чтобы продукт не устарел через полгода и его было легко развивать.',
  },
  {
    icon: BarChart3,
    title: 'Поддержка после запуска',
    text: 'Не бросаем после сдачи. Помогаем с правками, обновлениями и развитием.',
  },
]

function WhyUsCard({ icon: Icon, title, text, className }: WhyUsCardData & { className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  // На мобильных нет курсора для hover — вместо этого карточка сама
  // "загорается" оранжевым свечением, когда оказывается в центре экрана
  // при прокрутке. Работает через IntersectionObserver с узкой полосой
  // rootMargin вокруг середины вьюпорта: как только карточка её пересекает
  // — считаем, что она "перед пользователем", и включаем класс centerGlow.
  const [centerGlow, setCenterGlow] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    if (!window.matchMedia('(hover: none)').matches) return // только touch-устройства

    const observer = new IntersectionObserver(
      ([entry]) => setCenterGlow(entry.isIntersecting),
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    card.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      className={`${styles.card} ${className || ''} ${centerGlow ? styles.centerGlow : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
    >
      <span className={styles.glow} aria-hidden="true" />
      <span className={styles.iconBubble}>
        <Icon size={32} />
      </span>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
    </div>
  )
}

export default function WhyUs() {
  const { containerRef, isVisible } = useRevealOnScroll(CARDS.length)

  return (
    <section className={styles.section} id="why-us">
      <div className="container">
        <div className="sectionEyebrow">
          <HelpCircle size={32} color="rgba(17,17,17,0.8)" />
          <h2 style={{ color: 'rgba(17,17,17,0.8)', fontSize: 24 }}>Почему с нами спокойно?</h2>
        </div>
        <p className="sectionSubtitle" style={{ color: 'rgba(17,17,17,0.6)', marginTop: 20, fontSize: 18 }}>
          Мы убираем хаос из разработки. Чёткие договорённости, предсказуемые сроки и результат,
          которым можно гордиться.
        </p>

        <div className={styles.grid} ref={containerRef}>
          {CARDS.map((card, i) => (
            <WhyUsCard
              key={card.title}
              {...card}
              className={`reveal ${isVisible(i) ? 'reveal-visible' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
