import type { ReactNode } from 'react'
import type { CSSVars } from '../../types'
import iphoneRockMockup from '../../assets/images/iphone-rock-mockup.png'
import styles from './PageHero.module.css'

interface PageHeroProps {
  title: ReactNode
  subtitle?: ReactNode
  innerWidth?: number | string
  subtitleWidth?: number | string
}

export default function PageHero({
  title,
  subtitle,
  subtitleWidth = 700,
  innerWidth = 740
}: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} aria-hidden="true">
        <img src={iphoneRockMockup} alt="" />
      </div>

      <div
        className={`container ${styles.heroInner}`}
        style={{ '--inner-w': `${innerWidth}px` } as CSSVars}
      >
        <h1 className={styles.title}>{title}</h1>

        <p
          className={styles.subtitle}
          style={{ '--subtitle-w': `${subtitleWidth}px` } as CSSVars}
        >
          {subtitle}
        </p>
      </div>
    </section>
  )
}