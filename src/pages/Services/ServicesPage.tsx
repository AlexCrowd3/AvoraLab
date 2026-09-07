import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import Seo, { SITE_URL, breadcrumbsJsonLd } from '../../components/Seo/Seo'
import ServiceCards from './ServiceCards'
import { SERVICES } from '../../data/services'
import styles from './ServicesPage.module.css'

export default function ServicesPage() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Услуги Avora Lab',
    itemListElement: SERVICES.map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.shortTitle,
      url: `${SITE_URL}/services/${s.slug}`,
    })),
  }

  return (
    <>
      <Seo
        title="Услуги: разработка сайтов, приложений и Telegram-ботов | Avora Lab"
        description="Услуги студии Avora Lab: лендинги, интернет-магазины, веб-сервисы и личные кабинеты, Telegram-боты, мобильные приложения. Сроки, стоимость и состав работ по каждой услуге."
        path="/services"
        jsonLd={[
          itemListJsonLd,
          breadcrumbsJsonLd([
            { name: 'Главная', path: '/' },
            { name: 'Услуги', path: '/services' },
          ]),
        ]}
      />
      <Header />
      <main>
        <PageHero
          title="Наши услуги"
          subtitle="Разрабатываем цифровые продукты под ключ — от лендингов до сложных сервисов и приложений. С чёткими сроками, договором и понятным результатом"
        />

        {/* Быстрый переход к странице нужной услуги: удобно на телефоне,
            где карточки ниже листаются по одной, и полезно для перелинковки. */}
        <section className={styles.quickNav}>
          <div className="container">
            <h2 className={styles.quickNavTitle}>Выберите услугу</h2>
            <p className={styles.quickNavText}>
              На странице каждой услуги — что входит в разработку, этапы работы, сроки,
              стоимость, примеры проектов и форма заявки.
            </p>
            <div className={styles.quickNavGrid}>
              {SERVICES.map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`} className={styles.quickNavCard}>
                  <span className={styles.quickNavCardTitle}>
                    {s.shortTitle}
                    <ArrowUpRight size={18} />
                  </span>
                  <span className={styles.quickNavCardMeta}>
                    {s.price ?? 'Индивидуальный расчёт'} · срок {s.duration}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.searchSection}>
          <div className="container">
            <ServiceCards />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
