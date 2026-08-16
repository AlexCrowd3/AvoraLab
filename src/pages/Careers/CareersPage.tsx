import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import JobSearch from './JobSearch'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import styles from './CareersPage.module.css'

const JOBS = [
  {
    title: 'Frontend-разработчик (Junior)',
    location: 'Удалённо',
    desc: 'Ищем разработчика, который будет делать современные интерфейсы для сайтов, сервисов и приложений. Важен не только код, но и аккуратность, ответственность и умение доводить задачи до результата.',
    salary: 'От 80 000 рублей/месяц',
    requirements: [
      'Уверенный HTML, CSS, JavaScript',
      'React или Next',
      'Умение работать с макетами (Figma)',
      'Ответственность за сроки',
      'Понимание адаптивной вёрстки',
    ],
  },
  {
    title: 'UI/UX-дизайнер (Middle)',
    location: 'Удалённо',
    desc: 'Дизайнить лендинги, интернет-магазины и веб-сервисы, создавать современные и понятные интерфейсы, прорабатывать прототипы и адаптировать макеты под мобильные устройства. Участвовать в обсуждении структуры продукта и пользовательского сценария, а также готовить чистые макеты в Figma, удобные для передачи в разработку.',
    salary: 'От 60 000 рублей/месяц',
    requirements: [
      'Умение делать чистый, современный и аккуратный дизайн',
      'Опыт работы с Figma',
      'Вкус и внимание к деталям',
      'Ответственность за сроки',
      'Готовность дорабатывать макеты по обратной связи',
    ],
  },
]

export default function CareersPage() {
  const [query, setQuery] = useState('')

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return JOBS
    return JOBS.filter(
      (job) => job.title.toLowerCase().includes(q) || job.desc.toLowerCase().includes(q)
    )
  }, [query])

  const { containerRef, isVisible } = useRevealOnScroll(filteredJobs.length)

  return (
    <>
      <Header />
      <main>
        <PageHero
          title={
            <>
              Вакансии в <span style={{ color: 'rgba(253, 151, 48, 0.4)' }}>AvoraLab</span>
            </>
          }
          subtitle="Мы небольшая команда и ищем людей, с которыми можно делать сильные цифровые продукты. Без бюрократии и лишней иерархии."
          subtitleWidth={660}
        />

        <section className={styles.section}>
          <div className="container">
            <JobSearch value={query} onChange={setQuery} />

            {filteredJobs.length === 0 ? (
              <p className={styles.empty}>По запросу «{query}» вакансий не найдено.</p>
            ) : (
              <div className={styles.list} ref={containerRef}>
                {filteredJobs.map((job, i) => (
                  <article
                    key={job.title}
                    className={`${styles.card} reveal ${isVisible(i) ? 'reveal-visible' : ''}`}
                  >
                  <div className={styles.headRow}>
                    <h3 className={styles.jobTitle}>{job.title}</h3>
                    <span className={styles.locationBadge}>{job.location}</span>
                  </div>
                  <p className={styles.jobDesc}>{job.desc}</p>
                  <p className={styles.salary}>{job.salary}</p>
                  <div className={styles.reqRow}>
                    <div className={styles.reqList}>
                      <span className={styles.reqLabel}>Что нужно уметь:</span>
                      <div className={styles.reqPills}>
                        {job.requirements.map((r) => (
                          <span key={r} className={styles.reqPill}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link to="/contact" className={styles.applyBtn}>
                      Откликнуться
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            )}

            <article className={styles.ctaCard}>
              <div className={styles.ctaHead}>
                <h2 className={styles.ctaTitle}>Нет нужной вакансии? Не проблема</h2>
                <p className={styles.ctaSubtitle}>
                  Сейчас открытых позиций может не быть, но мы всё равно рады знакомству сильных
                  специалистов.
                </p>
              </div>
              <p className={styles.ctaDesc}>
                Если вы хотите работать с нами над проектами - напишите. Кратко расскажите о себе
                и своём опыте. Мы сохраним контакты и вернёмся, когда появится подходящая задача.
              </p>
              <Link to="/contact" className={styles.ctaBtn}>
                Написать <ArrowUpRight size={24} />
              </Link>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
