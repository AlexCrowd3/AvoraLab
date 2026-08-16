import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import CaseSearchFilter from './CaseSearchFilter'
import type { CaseFilters } from './CaseSearchFilter'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { CASES } from '../../data/cases'
import styles from './CasesPage.module.css'

export default function CasesPage() {
  const [filters, setFilters] = useState<CaseFilters>({ query: '', selectedTypes: [], priceFrom: 7000 })

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return CASES.filter((c) => {
      if (q && !c.title.toLowerCase().includes(q) && !c.desc.toLowerCase().includes(q)) {
        return false
      }
      if (filters.selectedTypes.length && !filters.selectedTypes.includes(c.category)) {
        return false
      }
      if (c.price < filters.priceFrom) {
        return false
      }
      return true
    })
  }, [filters])

  const { containerRef, isVisible } = useRevealOnScroll(filtered.length)

  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Наши Кейсы"
          subtitle="На этой странице расположены наши кейсы, вы можете подробно ознакомиться с ними и убедиться в качестве продукта заранее."
          subtitleWidth={620}
        />

        <section className={styles.section}>
          <div className="container">
            <CaseSearchFilter onChange={setFilters} />

            {filtered.length === 0 ? (
              <p className={styles.empty}>Ничего не найдено — попробуйте изменить фильтры.</p>
            ) : (
              <div className={styles.grid} ref={containerRef}>
                {filtered.map((c, i) => (
                  <article
                    key={i}
                    className={`${styles.card} reveal ${isVisible(i) ? 'reveal-visible' : ''}`}
                    style={{ transitionDelay: `${(i % 3) * 90}ms` }}
                  >
                    <div className={styles.imgWrap}>
                      <img src={c.img} alt="" loading="lazy" />
                      <span className={styles.categoryBadge}>{c.category}</span>
                    </div>
                    <div className={styles.content}>
                      <h3 className={styles.title}>{c.title}</h3>
                      <p className={styles.desc}>{c.desc}</p>
                      <div className={styles.tags}>
                        {c.tags.slice(0, 2).map((t) => (
                          <span key={t} className={styles.tag}>
                            {t}
                          </span>
                        ))}

                        {c.tags.length > 2 && (
                          <span className={`${styles.tag} ${styles.tagMore}`}>
                            +{c.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                    <Link to={`/cases/${c.slug}`} className={styles.viewBtn}>
                      Смотреть кейс <ArrowUpRight size={20} />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
