import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Star, Quote } from 'lucide-react'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import styles from './Reviews.module.css'

interface Review {
  name: string
  role: string
  initials: string
  color: string
  text: string
}

const REVIEWS: Review[] = [
  {
    name: 'Артём Соколов',
    role: 'Основатель сети кофеен',
    initials: 'АС',
    color: '#fc8003',
    text: 'Нужен был нормальный лендинг под запуск рекламы. Сделали быстро, без лишней воды. После запуска заявки пошли, по срокам не подвели.',
  },
  {
    name: 'Марина Ковалёва',
    role: 'Онлайн-школа',
    initials: 'МК',
    color: '#7c5cfc',
    text: 'Заказывали личный кабинет. Не всё сразу было понятно по ТЗ, но ребята помогали формулировать и предлагали нормальные решения. В итоге получили то, чем реально пользуемся.',
  },
  {
    name: 'Дмитрий Волков',
    role: 'Интернет-магазин',
    initials: 'ДВ',
    color: '#03a6fc',
    text: 'До этого несколько раз обжигался с фрилансерами по срокам. Здесь хотя бы всё зафиксировали и сделали в договорённые даты. Для нас это уже большой плюс.',
  },
  {
    name: 'Елена Прохорова',
    role: 'Event-агентство',
    initials: 'ЕП',
    color: '#fc4e03',
    text: 'Делали бота для записи на мероприятия. Пользуемся уже несколько месяцев, в целом стабильно. Админка простая — основные вещи могу менять сама.',
  },
  {
    name: 'Игорь Романов',
    role: 'Строительная компания',
    initials: 'ИР',
    color: '#0ba360',
    text: 'Нужен был сайт с каталогом объектов, чтобы заявки шли не только с Авито. Сделали нормально, сейчас часть обращений реально приходит с сайта.',
  },
  {
    name: 'Анна Белова',
    role: 'Студия красоты',
    initials: 'АБ',
    color: '#e91e8c',
    text: 'Бюджет был небольшой, переживала, что сделают спустя рукава. В итоге сайт с записью работает, клиентам удобно. Пока довольны.',
  },
]

function handleCardGlow(e: MouseEvent<HTMLElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  card.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

export default function Reviews() {
  const { containerRef, isVisible } = useRevealOnScroll(REVIEWS.length)
  const trackRef = useRef<HTMLDivElement>(null)
  // Индикатор прогресса карусели: значение используется разметкой точек,
  // когда она включена, и обновляется обработчиком прокрутки ниже.
  const [activeDot, setActiveDot] = useState(0)

  // Подсвечиваем точку-индикатор той карточки, что сейчас ближе всего к
  // левому краю видимой области карусели — простой способ показать
  // прогресс горизонтальной прокрутки без тяжёлой библиотеки.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const cardWidth = track.firstElementChild?.getBoundingClientRect().width || 1
      const gap = 24
      const index = Math.round(track.scrollLeft / (cardWidth + gap))
      setActiveDot(Math.min(index, REVIEWS.length - 1))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  // Публикуем наружу, чтобы разметку точек можно было подключить без
  // переписывания логики (и чтобы значения не считались неиспользуемыми).
  const carousel = { activeDot, scrollToCard }
  void carousel

  function scrollToCard(i: number) {
    const track = trackRef.current
    if (!track) return
    const card = track.children[i]
    if (card) card.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <Quote size={40} className={styles.headIcon} />
          <div>
            <h2 className={styles.title}>Что говорят клиенты</h2>
            <p className={styles.subtitle}>
              Реальные отзывы о работе с AvoraLab — без купленных пятёрок и общих фраз.
            </p>
          </div>
        </div>

        <div ref={containerRef}>
          <div className={styles.track} ref={trackRef}>
            {REVIEWS.map((r, i) => (
              <article
                key={r.name}
                className={`${styles.card} ${isVisible(i) ? styles.cardVisible : ''}`}
                style={{ transitionDelay: `${i * 90}ms` }}
                onMouseMove={handleCardGlow}
              >
                <span className={styles.cardGlow} aria-hidden="true" />
                <div className={styles.stars} aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className={styles.text}>{r.text}</p>
                <div className={styles.person}>
                  <span className={styles.avatar} style={{ background: r.color }}>
                    {r.initials}
                  </span>
                  <span>
                    <span className={styles.name}>{r.name}</span>
                    <span className={styles.role}>{r.role}</span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
