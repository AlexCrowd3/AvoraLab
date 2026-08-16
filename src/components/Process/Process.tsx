import type { MouseEvent } from 'react'
import { LineChart, Search, PenTool, Code, Ruler, Play } from 'lucide-react'
import stage1 from '../../assets/images/stage-1-analysis.webp'
import stage2 from '../../assets/images/stage-2-design.webp'
import stage3 from '../../assets/images/stage-3-development.webp'
import stage4 from '../../assets/images/stage-4-testing.webp'
import stage5 from '../../assets/images/stage-5-launch.webp'
import styles from './Process.module.css'

function handleCardGlow(e: MouseEvent<HTMLElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  card.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

const STAGES = [
  {
    n: '1',
    icon: Search,
    title: 'Анализ и стратегия',
    text: 'Разбираем задачу, аудиторию и цели. Фиксируем, что именно должно получиться на выходе.',
    img: stage1,
    rotate: 10.9,
  },
  {
    n: '2',
    icon: PenTool,
    title: 'Дизайн и прототип',
    text: 'Делаем прототип и дизайн. Согласовываем внешний вид и логику до начала разработки.',
    img: stage2,
    rotate: 15,
  },
  {
    n: '3',
    icon: Code,
    title: 'Разработка',
    text: 'Пишем чистый код и регулярно показываем прогресс. Вы видите, как растёт продукт.',
    img: stage3,
    rotate: 15,
    offsetY: 14,
  },
  {
    n: '4',
    icon: Ruler,
    title: 'Тестирование',
    text: 'Проверяем на разных устройствах, ищем ошибки и всё исправляем до запуска.',
    img: stage4,
    rotate: -32,
    offsetY: 18,
  },
  {
    n: '5',
    icon: Play,
    title: 'Запуск и поддержка',
    text: 'Выкладываем проект, настраиваем аналитику и остаёмся на связи после релиза.',
    img: stage5,
    rotate: 13.1,
  },
]

export default function Process() {
  return (
    <section className={styles.section} id="process">
      <div className="container">
        <div className="sectionEyebrow">
          <LineChart size={32} color="rgba(17,17,17,0.8)" />
          <h2 style={{ color: 'rgba(17,17,17,0.8)', fontSize: 24 }}>Прозрачный путь от идеи до запуска</h2>
        </div>
        <p className="sectionSubtitle" style={{ color: 'rgba(17,17,17,0.6)', marginTop: 20, fontSize: 18 }}>
          Каждый этап завершается осязаемым результатом. Вы всегда понимаете, на каком шаге
          находится проект и что будет дальше.
        </p>

        <div className={styles.row}>
          {STAGES.map(({ n, icon: Icon, title, text, img, rotate, offsetY = 0 }) => (
            <article key={n} className={styles.card} onMouseMove={handleCardGlow}>
              <span className={styles.cardGlow} aria-hidden="true" />
              <div className={styles.glow} aria-hidden="true" />
              <div className={styles.top}>
                <span className={styles.iconBubble}>
                  <Icon size={32} />
                </span>
                <span className={styles.number}>{n}</span>
              </div>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.text}>{text}</p>
              <div className={styles.artWrap}>
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  className={styles.art}
                  style={{ transform: `translateY(${offsetY}px) rotate(${rotate}deg)` }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
