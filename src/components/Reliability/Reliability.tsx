import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowUpRight, Calendar, ArrowRight } from 'lucide-react'
import contractPhoto from '../../assets/images/contract-photo.webp'
import styles from './Reliability.module.css'

const TAGS = ['Полноценный договор', 'Смета', 'Четкое ТЗ', 'Поэтапные отчеты', 'Грантия качества']

function handleCardGlow(e: MouseEvent<HTMLElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  card.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  card.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

export default function Reliability() {
  return (
    <section className={styles.section} id="reliability">
      <div className="container">
        <div className="sectionEyebrow">
          <ShieldCheck size={32} color="rgba(255,255,255,0.8)" />
          <h2 style={{ color: 'rgba(255,255,255,0.8)', fontSize: 24, }}>Надежность на каждом этапе</h2>
        </div>
        <p className="sectionSubtitle" style={{ color: 'rgba(255,255,255,0.6)', marginTop: 20, fontSize: 18 }}>
          Мы убираем главную боль работы с подрядчиками - неопределённость. Каждый проект ведём по
          договору с зафиксированными сроками и ценой.
        </p>

        <div className={styles.row}>
          <article className={styles.mainCard} onMouseMove={handleCardGlow}>
            <span className={styles.cardGlow} aria-hidden="true" />
            <div className={styles.mainGlow} aria-hidden="true" />
            <div className={styles.mainText}>
              <h3 className={styles.mainTitle}>Работаем по договору</h3>
              <p className={styles.mainDesc}>
                Все обязательства, сроки и стоимость прописываем заранее. Вы получаете прозрачный
                процесс и результат, который соответствует договорённостям.
              </p>
              <div className={styles.tags}>
                {TAGS.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
              <Link to="/contact" className={styles.mainBtn}>
                Оставить заявку <ArrowUpRight size={24} />
              </Link>
            </div>
            <img src={contractPhoto} alt="" loading="lazy" className={styles.mainImg} />
          </article>

          <div className={styles.sideCol}>
            <article
              className={`${styles.sideCard} ${styles.sideCardPurple}`}
              onMouseMove={handleCardGlow}
            >
              <span className={styles.cardGlow} aria-hidden="true" />
              <div className={styles.sideHead}>
                <Calendar size={32} />
                <h3 className={styles.sideTitle}>Фиксируем сроки</h3>
              </div>
              <p className={styles.sideDesc}>
                Дедлайны прописаны в договоре. Никаких «ещё немного» и переносов без согласования.
              </p>
              <Link to="/contact" className={styles.sideLink}>
                <span>Подробнее</span>
                <ArrowRight size={24} className={styles.sideLinkArrow} />
              </Link>
            </article>

            <article
              className={`${styles.sideCard} ${styles.sideCardTeal}`}
              onMouseMove={handleCardGlow}
            >
              <span className={styles.cardGlow} aria-hidden="true" />
              <div className={styles.sideHead}>
                <ShieldCheck size={32} />
                <h3 className={styles.sideTitleNowrap}>Гарантия результата</h3>
              </div>
              <p className={styles.sideDesc}>
                Если что-то идёт не так — исправляем за свой счёт. Вы платите за готовый рабочий
                продукт.
              </p>
              <Link to="/contact" className={styles.sideLink}>
                <span>Подробнее</span>
                <ArrowRight size={24} className={styles.sideLinkArrow} />
              </Link>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
