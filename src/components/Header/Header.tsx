import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { PhoneCall, Menu, X } from 'lucide-react'
import Logo from './Logo'
import styles from './Header.module.css'

interface NavItem {
  label: string
  href: string
}

interface NavClassNames {
  item: string
  active: string
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Главная', href: '/' },
  { label: 'Услуги', href: '/services' },
  { label: 'Кейсы', href: '/cases' },
  { label: 'Вакансии', href: '/careers' },
]

export default function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuMounted, setMenuMounted] = useState(false)

  function openMenu() {
    setMenuMounted(true)
    // mount closed first, then flip to open on the next frame so the
    // slide-in transition actually runs instead of snapping open instantly
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuOpen(true)))
  }

  function closeMenu() {
    setMenuOpen(false)
    // keep the drawer in the DOM just long enough for the close transition
    // to finish, then drop it entirely so an off-screen fixed element can
    // never contribute to the page's horizontal scroll width
    setTimeout(() => setMenuMounted(false), 480)
  }

  // Close the mobile menu whenever the route changes (e.g. after tapping a link).
  useEffect(() => {
    if (menuOpen) closeMenu()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Lock background scroll while the drawer is open, and allow closing with Escape.
  useEffect(() => {
    if (!menuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen])

  function renderNavItem(item: NavItem, className: NavClassNames) {
    const isActive = item.href === '/' ? pathname === '/' : pathname === item.href
    const cls = isActive ? className.active : className.item
    if (item.href.startsWith('/#')) {
      return (
        <a key={item.label} href={item.href} className={cls}>
          {item.label}
        </a>
      )
    }
    return (
      <Link key={item.label} to={item.href} className={cls}>
        {item.label}
      </Link>
    )
  }

  return (
    <header className={styles.header} id="top">
      <Link to="/" aria-label="AvoraLab — на главную">
        <Logo className={styles.logo} />
      </Link>

      <nav className={styles.nav} aria-label="Основная навигация">
        {NAV_ITEMS.map((item) =>
          renderNavItem(item, { item: styles.navItem, active: styles.navItemActive })
        )}
      </nav>

      <Link to="/contact" className={styles.cta}>
        <PhoneCall size={16} />
        <span>Обсудить проект</span>
      </Link>

      <button
        type="button"
        className={styles.burger}
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={menuOpen}
        onClick={() => (menuOpen ? closeMenu() : openMenu())}
      >
        <Menu size={24} className={`${styles.burgerIcon} ${menuOpen ? styles.iconHidden : ''}`} />
        <X size={24} className={`${styles.burgerIcon} ${styles.burgerIconX} ${menuOpen ? '' : styles.iconHidden}`} />
      </button>

      {/* Меню рендерится порталом в body: у шапки есть backdrop-filter,
          а он превращает её в точку отсчёта для position:fixed потомков —
          из-за этого меню получало высоту шапки (84px) вместо высоты экрана,
          и его содержимое вылезало за пределы панели. */}
      {menuMounted &&
        createPortal(
          <>
            <div
              className={`${styles.backdrop} ${menuOpen ? styles.backdropOpen : ''}`}
              onClick={closeMenu}
              aria-hidden="true"
            />

            <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
              <div className={styles.drawerTop}>
                <Logo className={styles.logoMobile}/>
              </div>
              <nav className={styles.drawerNav} aria-label="Мобильная навигация">
                {NAV_ITEMS.map((item) =>
                  renderNavItem(item, { item: styles.drawerItem, active: styles.drawerItemActive })
                )}
              </nav>
              <Link to="/contact" className={styles.drawerCta} onClick={closeMenu}>
                <PhoneCall size={18} />
                <span>Обсудить проект</span>
              </Link>
              <div className={styles.drawerInfo}>
                <a href="tel:+79319792764">
                  +7 (931) 979-27-64
                </a>

                <a href="mailto:avora-lab@gmail.com">
                  avora-lab@gmail.com
                </a>
              </div>
            </div>
          </>,
          document.body
        )}
    </header>
  )
}
