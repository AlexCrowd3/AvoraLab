import type { FormEvent } from 'react'
import { useState } from 'react'
import { ArrowUpRight, Send, Mail, PhoneCall } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import ctaLaptop from '../../assets/images/cta-laptop.webp'
import iphoneRock from '../../assets/images/iphone-rock-mockup.png'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [contact, setContact] = useState('')
  const [name, setName] = useState('')

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweW73C-C9D8yhzMm7a9wTmq0LDvZXjqBqWla1XQP-DTRyxRmE4Rs2Gcu9EcamrAaGTCw/exec'

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!contact.trim() || loading) return

    setLoading(true)

    try {
      const utm = JSON.parse(
        localStorage.getItem('utm_data') || 'null'
      )

      const payload = {
        formType: 'contact',

        date: new Date().toLocaleString('ru-RU'),

        utm: utm
          ? Object.entries(utm)
            .filter(
              ([key, value]) =>
                (key.startsWith('utm_') || key === 'yclid') &&
                value
            )
            .map(([key, value]) => `${key}=${value}`)
            .join(' | ')
          : '',

        contact,
        name,
      }

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      navigate('/thanks')
    } catch (error) {
      console.error(error)
      alert('Ошибка отправки заявки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main>
        <section className={styles.hero}>
          <div className={styles.bgImages} aria-hidden="true">
            <img src={ctaLaptop} alt="" className={styles.bgLaptop} />
            <img src={iphoneRock} alt="" className={styles.bgPhone} />
          </div>

          <div className={`container ${styles.inner}`}>
            <div className={styles.left}>
              <h1 className={styles.title}>Обсудим ваш проект?</h1>
              <p className={styles.subtitle}>
                Оставьте заявку или напишите нам напрямую. Мы перезвоним или ответим в мессенджере,
                уточним задачу и предложим оптимальный вариант с сроками и бюджетом.
              </p>

              <form className={styles.form} onSubmit={handleSubmit}>
                <span className={styles.formLabel}>Заполните ваши данные</span>
                <label className={styles.fieldLabel} htmlFor="contact-value">
                  Номер телефона / Telegram
                </label>
                <input
                  id="contact-value"
                  type="tel"
                  className={styles.input}
                  placeholder="+7 (000) 000-00-00 / @NICK_TG"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
                <label className={styles.fieldLabel} htmlFor="name-value">
                  Как к вам обращаться?
                </label>
                <input
                  id="name-value"
                  type="text"
                  className={styles.input}
                  placeholder="Иван Иванович"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.loader}></span>
                      Отправка...
                    </>
                  ) : (
                    <>
                      <span>Оставить заявку</span>
                      <ArrowUpRight size={22} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className={styles.contactCards}>
              <a href="#" className={`${styles.pill} ${styles.pillTelegram}`}>
                <Send size={24} />
                <span>Telegram</span>
              </a>
              <a href="mailto:avora-lab@gmail.com" className={`${styles.pill} ${styles.pillMail}`}>
                <Mail size={24} />
                <span>avora-lab@gmail.com</span>
              </a>
              <a href="tel:+79319792764" className={`${styles.pill} ${styles.pillPhone}`}>
                <PhoneCall size={24} />
                <span>+7 (931) 979-27-64</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
