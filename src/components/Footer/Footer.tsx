import { Link } from 'react-router-dom'
import { Send, Mail } from 'lucide-react'
import Logo from '../Header/Logo'
import styles from './Footer.module.css'

const NAV_COL = {
  title: 'Навигация',
  links: [
    { label: 'Главная', href: '/' },
    { label: 'Услуги', href: '/services' },
    { label: 'Кейсы', href: '/cases' },
    { label: 'Вакансии', href: '/careers' },
  ],
}

const STUDIO_COL = {
  title: 'Студия',
  links: [
    { label: 'Кейсы', href: '/cases' },
    { label: 'Отзывы', href: '/#why-us' },
    { label: 'Этапы работы', href: '/#process' },
    { label: 'Оставить заявку', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.row}`}>
        <div className={styles.brandCol}>
          <Logo className={styles.logo} />
          <p className={styles.desc}>
            Веб-студия полного цикла. Разрабатываем сайты, сервисы и приложения, которые работают
            и приносят прибыль. Под ключ, по договору, в срок.
          </p>
          <div className={styles.social}>
            <a href="#" className={styles.socialIcon} aria-label="Telegram">
              <Send size={20} />
            </a>
            <a href="mailto:avora-lab@gmail.com" className={styles.socialIcon} aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <nav className={styles.navCol} aria-label="Навигация">
          <h3 className={styles.colTitle}>{NAV_COL.title}</h3>
          <ul className={styles.linkList}>
            {NAV_COL.links.map((l) => (
              <li key={l.label}>
                {l.href.startsWith('/#') ? (
                  <a href={l.href}>{l.label}</a>
                ) : (
                  <Link to={l.href}>{l.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.navCol} aria-label="Студия">
          <h3 className={styles.colTitle}>{STUDIO_COL.title}</h3>
          <ul className={styles.linkList}>
            {STUDIO_COL.links.map((l) => (
              <li key={l.label}>
                {l.href.startsWith('/#') ? (
                  <a href={l.href}>{l.label}</a>
                ) : (
                  <Link to={l.href}>{l.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.navCol}>
          <h3 className={styles.colTitle}>Контакты</h3>
          <ul className={styles.linkList}>
            <li>
              <a href="#">Telegram</a>
            </li>
            <li>
              <a href="mailto:avora-lab@gmail.com">avora-lab@gmail.com</a>
            </li>
            <li>
              <a href="tel:+79319792764">+7 (931) 979-27-64</a>
            </li>
            <li>
              <span>Санкт-Петербург</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
