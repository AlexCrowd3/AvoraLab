import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import styles from './ThanksPage.module.css'

export default function ThanksPage() {
  return (
    <>
      <Header />

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.card}>
              <div className={styles.icon}>
                <CheckCircle2 size={72} />
              </div>

              <h1 className={styles.title}>
                Спасибо за заявку!
              </h1>

              <p className={styles.text}>
                Мы получили ваши данные и уже начали
                обработку обращения.
              </p>

              <p className={styles.text}>
                В ближайшее время свяжемся с вами,
                уточним детали проекта и предложим
                оптимальное решение по срокам и бюджету.
              </p>

              <Link to="/" className={styles.button}>
                <ArrowLeft size={18} />
                Вернуться на главную
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}