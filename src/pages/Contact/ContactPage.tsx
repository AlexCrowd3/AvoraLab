import type { FormEvent } from 'react'
import { useState } from 'react'
import { AlertCircle, ArrowUpRight, Send, Mail, PhoneCall } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Seo, { breadcrumbsJsonLd } from '../../components/Seo/Seo'
import ConsentCheckbox, { CONSENT_TEXT } from '../../components/ConsentCheckbox/ConsentCheckbox'
import { submitLead } from '../../lib/leads'
import { SERVICE_OPTIONS } from '../../data/services'
import ctaLaptop from '../../assets/images/cta-laptop.webp'
import iphoneRock from '../../assets/images/iphone-rock-mockup.png'
import styles from './ContactPage.module.css'

interface Errors {
  name?: string
  phone?: string
  contact?: string
  consent?: string
  submit?: string
}

const PHONE_RE = /^[+()\-\s\d]{6,20}$/

export default function ContactPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Услуга может прийти из ссылки: /contact?service=Лендинг
  const presetService = searchParams.get('service')
  const initialService =
    presetService && [...SERVICE_OPTIONS, 'Другая задача'].includes(presetService)
      ? presetService
      : ''

  const [service, setService] = useState(initialService)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [contact, setContact] = useState('')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false) // галочка никогда не стоит заранее
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = 'Укажите, как к вам обращаться'
    if (!phone.trim()) next.phone = 'Укажите номер телефона'
    else if (!PHONE_RE.test(phone.trim())) next.phone = 'Проверьте формат номера'
    if (!contact.trim()) next.contact = 'Укажите email или Telegram'
    if (!consent) next.consent = 'Без согласия на обработку данных мы не можем принять заявку'
    return next
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus()
      return
    }

    setLoading(true)
    try {
      await submitLead({
        formType: 'contact',
        service: service || 'Не выбрана',
        name: name.trim(),
        phone: phone.trim(),
        contact: contact.trim(),
        comment: comment.trim(),
        consent: `да — ${CONSENT_TEXT}`,
      })
      navigate('/thanks')
    } catch (error) {
      console.error(error)
      setErrors({
        submit:
          'Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз или напишите нам в Telegram.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Контакты Avora Lab — оставить заявку на разработку"
        description="Свяжитесь с Avora Lab: телефон, почта и Telegram. Оставьте заявку — обсудим задачу, предложим решение и сориентируем по срокам и стоимости."
        path="/contact"
        jsonLd={[
          breadcrumbsJsonLd([
            { name: 'Главная', path: '/' },
            { name: 'Контакты', path: '/contact' },
          ]),
        ]}
      />
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

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <span className={styles.formLabel}>Заполните ваши данные</span>

                <label className={styles.fieldLabel} htmlFor="contact-service">
                  Какая услуга интересует
                </label>
                <select
                  id="contact-service"
                  className={styles.select}
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="">Пока не определился</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  <option value="Другая задача">Другая задача</option>
                </select>

                <label className={styles.fieldLabel} htmlFor="contact-name">
                  Как к вам обращаться? <span className={styles.req}>*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  placeholder="Иван Иванович"
                  value={name}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className={styles.fieldError}>{errors.name}</span>}

                <label className={styles.fieldLabel} htmlFor="contact-phone">
                  Номер телефона <span className={styles.req}>*</span>
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  autoComplete="tel"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  placeholder="+7 (000) 000-00-00"
                  value={phone}
                  aria-invalid={Boolean(errors.phone)}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}

                <label className={styles.fieldLabel} htmlFor="contact-contact">
                  Email или Telegram <span className={styles.req}>*</span>
                </label>
                <input
                  id="contact-contact"
                  type="text"
                  className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
                  placeholder="mail@example.com / @NICK_TG"
                  value={contact}
                  aria-invalid={Boolean(errors.contact)}
                  onChange={(e) => setContact(e.target.value)}
                />
                {errors.contact && <span className={styles.fieldError}>{errors.contact}</span>}

                <label className={styles.fieldLabel} htmlFor="contact-comment">
                  Комментарий к задаче
                </label>
                <textarea
                  id="contact-comment"
                  className={styles.textarea}
                  placeholder="Коротко о проекте: что нужно сделать и к какой дате"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <div className={styles.consentRow}>
                  <ConsentCheckbox
                    id="contact-consent"
                    onDark
                    checked={consent}
                    onChange={(v) => {
                      setConsent(v)
                      if (v) setErrors((prev) => ({ ...prev, consent: undefined }))
                    }}
                    error={errors.consent}
                  />
                </div>

                {errors.submit && (
                  <p className={styles.formError} role="alert">
                    <AlertCircle size={18} />
                    <span>{errors.submit}</span>
                  </p>
                )}

                <button type="submit" className={styles.submit} disabled={loading}>
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
              <a
                href="https://t.me/RAFF_LEMs"
                className={`${styles.pill} ${styles.pillTelegram}`}
              >
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
