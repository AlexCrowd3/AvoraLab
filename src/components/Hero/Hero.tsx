import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen, Clock, Calendar, Check } from 'lucide-react'
import heroPhoneMockup from '../../assets/images/hero-phone-mockup.webp'
import RingShape from './RingShape'
import styles from './Hero.module.css'

const FLOATING_BADGES = [
  { icon: Clock, label: 'Лендинг за 5 дней', className: styles.badge1 },
  { icon: Calendar, label: 'Фиксированные сроки', className: styles.badge2 },
  { icon: Check, label: 'Полный цикл под ключ', className: styles.badge3 },
]

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.decorativeLayer} aria-hidden="true">
        <RingShape className={styles.decorativeFlower} />
      </div>

      <div className={styles.inner}>
        <div className={styles.textCol}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            Ждем вашу заявку
          </div>

          <h1 className={styles.heading}>
            <span className={styles.headingAccent}>AvoraLab</span> - студия полного цикла. Делаем лендинги, магазины, сервисы и ботов под ключ. <br/>
            С чёткими сроками и договором.
          </h1>

          <p className={styles.subtext}>
            AvoraLab - студия полного цикла. Превращаем идеи в лендинги, магазины, сервисы и
            приложения, которые продают. Дизайн, разработка и запуск под ключ - точно в срок и по
            договору.
          </p>

          <div className={styles.ctaRow}>
            <Link to="/contact" className={styles.btnPrimary}>
              Обсудить проект <ArrowUpRight size={24} />
            </Link>
            <a href="#services" className={styles.btnDark}>
              Смотреть кейсы <BookOpen size={22} />
            </a>
          </div>

          <div className={styles.proof}>
            <div className={styles.avatars}>
              <span className={styles.avatar} style={{ background: '#626262' }} />
              <span className={styles.avatar} style={{ background: '#808080' }} />
              <span className={styles.avatar} style={{ background: '#9e9e9e' }} />
            </div>
            <span className={styles.proofText}>
              <span className={styles.proofSoft}>Работаем с </span>
              <span className={styles.proofStrong}>бизнесом</span>
              <span className={styles.proofSoft}> любого масштаба</span>
            </span>
          </div>
        </div>

        <div className={styles.visualCol}>
          <div className={styles.stage}>
            <div className={styles.phoneWrap}>
              <img
                src={heroPhoneMockup}
                alt="Мокап приложения AvoraLab на iPhone"
                className={styles.phoneImg}
                fetchPriority="high"
              />
            </div>

            {FLOATING_BADGES.map(({ icon: Icon, label, className }) => (
              <div key={label} className={`${styles.floatBadge} ${className}`}>
                <span className={styles.floatIconWrap}>
                  <Icon size={24} />
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
