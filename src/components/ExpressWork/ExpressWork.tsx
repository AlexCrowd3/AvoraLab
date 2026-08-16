import { Link } from 'react-router-dom'
import { FastForward, Check, ArrowUpRight } from 'lucide-react'
import laptopClock from '../../assets/images/express-laptop-clock.webp'
import styles from './ExpressWork.module.css'

// Пункты списка "что это значит на практике" — совпадают один в один с текстом из Figma.
const POINTS = [
  'Лендинг — не за 5–7 дней, а за 1–2 дня',
  'Бот — значительно быстрее обычных сроков',
  'Сервис или магазин — с максимальным приоритетом',
]

export default function ExpressWork() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.head}>
          <FastForward size={40} className={styles.headIcon} />
          <div>
            <h2 className={styles.title}>Экспресс-разработка</h2>
            <p className={styles.subtitle}>Нужен результат очень быстро?</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.artWrap} aria-hidden="true">
            <div className={styles.artGlow} />
            <img src={laptopClock} alt="" loading="lazy" className={styles.art} />
          </div>

          <div className={styles.content}>
            <p className={styles.headline}>
              Мы можем сократить срок проекта до 20% от стандартного за счёт приоритетной работы
              команды.
            </p>

            <div className={styles.pointsBlock}>
              <span className={styles.pointsLabel}>Что это значит на практике:</span>
              <ul className={styles.pointsList}>
                {POINTS.map((p) => (
                  <li key={p} className={styles.point}>
                    <Check size={14} strokeWidth={3} className={styles.pointCheck} />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className={styles.note}>
              Вы получаете тот же качественный результат, но в ускоренном режиме. Подходит, когда
              нужно запуститься к рекламной кампании, акции или важному дедлайну.
            </p>

            <div className={styles.bottomRow}>
              <p className={styles.fineprint}>
                В условия входит доплата за приоритет, фиксируем новый срок в договоре
              </p>
              <Link to="/contact" className={styles.cta}>
                Обсудить экспресс-срок <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
