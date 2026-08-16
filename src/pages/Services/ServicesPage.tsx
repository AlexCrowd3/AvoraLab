import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import PageHero from '../../components/PageHero/PageHero'
import ServiceCards from './ServiceCards'
import styles from './ServicesPage.module.css'

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <PageHero
          title="Наши услуги"
          subtitle="Разрабатываем цифровые продукты под ключ — от лендингов до сложных сервисов и приложений. С чёткими сроками, договором и понятным результатом"
        />

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
