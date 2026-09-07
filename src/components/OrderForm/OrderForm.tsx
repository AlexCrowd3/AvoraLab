import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  LayoutGrid,
  Mail,
  PhoneCall,
  Send,
} from 'lucide-react'
import ConsentCheckbox, { CONSENT_TEXT } from '../ConsentCheckbox/ConsentCheckbox'
import { submitLead } from '../../lib/leads'
import { SERVICE_OPTIONS } from '../../data/services'
import styles from './OrderForm.module.css'

/**
 * Форма заявки. Один компонент на весь сайт: используется на страницах
 * услуг (с предвыбранной услугой) и может быть переиспользован в любом
 * другом месте.
 *
 * Особенности:
 *  • выбранная услуга подставляется автоматически и уходит в заявку;
 *  • согласие на обработку ПД обязательно и по умолчанию не отмечено;
 *  • без обязательных полей и согласия форма не отправляется;
 *  • после успешной отправки показывается сообщение прямо на месте формы,
 *    без ухода со страницы услуги.
 */

interface OrderFormProps {
  /** Название услуги, подставляемое в заявку. */
  service?: string
  /** Заголовок блока. */
  title?: string
  /** Подзаголовок. */
  subtitle?: string
  /** Надпись над заголовком. */
  eyebrow?: string
  /** Текст кнопки отправки. */
  submitLabel?: string
  /** id секции — для якорной ссылки с кнопки «Заказать услугу». */
  id?: string
}

interface Errors {
  name?: string
  phone?: string
  contact?: string
  consent?: string
  submit?: string
}

const PHONE_RE = /^[+()\-\s\d]{6,20}$/

export default function OrderForm({
  service,
  title = 'Оставьте заявку',
  subtitle = 'Заполните форму — свяжемся, уточним задачу и пришлём оценку по срокам и стоимости.',
  eyebrow = 'Заказать',
  submitLabel = 'Отправить заявку',
  id = 'order',
}: OrderFormProps) {
  const [selectedService, setSelectedService] = useState(service ?? SERVICE_OPTIONS[0])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [contact, setContact] = useState('')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false) // всегда false при монтировании
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  // При переходе между страницами услуг подставляем новую услугу.
  useEffect(() => {
    if (service) setSelectedService(service)
  }, [service])

  function validate(): Errors {
    const next: Errors = {}
    if (!name.trim()) next.name = 'Укажите, как к вам обращаться'
    if (!phone.trim()) next.phone = 'Укажите номер телефона'
    else if (!PHONE_RE.test(phone.trim())) next.phone = 'Проверьте формат номера'
    if (!contact.trim()) next.contact = 'Укажите email или Telegram для связи'
    if (!consent) next.consent = 'Без согласия на обработку данных мы не можем принять заявку'
    return next
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (loading) return

    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) {
      // Переводим фокус на первое поле с ошибкой — так удобнее и на мобильном.
      const firstKey = Object.keys(found)[0]
      document.getElementById(`${id}-${firstKey}`)?.focus()
      return
    }

    setLoading(true)
    try {
      await submitLead({
        formType: 'service',
        service: selectedService,
        name: name.trim(),
        phone: phone.trim(),
        contact: contact.trim(),
        comment: comment.trim(),
        consent: `да — ${CONSENT_TEXT}`,
      })
      setSent(true)
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

  function reset() {
    setName('')
    setPhone('')
    setContact('')
    setComment('')
    setConsent(false)
    setErrors({})
    setSent(false)
  }

  return (
    <section className={styles.section} id={id}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.glow} aria-hidden="true" />

          <div className={styles.intro}>
            <span className={styles.eyebrow}>{eyebrow}</span>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.subtitle}>{subtitle}</p>

            {service && (
              <span className={styles.selected}>
                <LayoutGrid size={18} />
                <span className={styles.selectedLabel}>Услуга:</span>
                <strong>{service}</strong>
              </span>
            )}

            <div className={styles.contactsRow}>
              <a href="https://t.me/RAFF_LEMs" className={styles.contactPill}>
                <Send size={18} />
                <span>Telegram</span>
              </a>
              <a href="mailto:avora-lab@gmail.com" className={styles.contactPill}>
                <Mail size={18} />
                <span>avora-lab@gmail.com</span>
              </a>
              <a href="tel:+79319792764" className={styles.contactPill}>
                <PhoneCall size={18} />
                <span>+7 (931) 979-27-64</span>
              </a>
            </div>
          </div>

          {sent ? (
            <div className={styles.success} role="status" aria-live="polite">
              <span className={styles.successIcon}>
                <CheckCircle2 size={34} />
              </span>
              <h3 className={styles.successTitle}>Спасибо! Ваша заявка отправлена</h3>
              <p className={styles.successText}>
                Мы свяжемся с вами в ближайшее время: уточним детали
                {service ? ` по услуге «${service}»` : ' по вашей задаче'} и предложим решение
                со сроками и стоимостью.
              </p>
              <div className={styles.successRow}>
                <a href="https://t.me/RAFF_LEMs" className={styles.successBtn}>
                  <Send size={17} />
                  Написать в Telegram
                </a>
                <button
                  type="button"
                  onClick={reset}
                  className={`${styles.successBtn} ${styles.successBtnGhost}`}
                >
                  Отправить ещё одну заявку
                </button>
              </div>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${id}-service`}>
                  Услуга
                </label>
                <select
                  id={`${id}-service`}
                  className={styles.select}
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  <option value="Другая задача">Другая задача</option>
                </select>
              </div>

              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${id}-name`}>
                    Имя <span className={styles.req}>*</span>
                  </label>
                  <input
                    id={`${id}-name`}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    type="text"
                    autoComplete="name"
                    placeholder="Иван"
                    value={name}
                    aria-invalid={Boolean(errors.name)}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor={`${id}-phone`}>
                    Телефон <span className={styles.req}>*</span>
                  </label>
                  <input
                    id={`${id}-phone`}
                    className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+7 (000) 000-00-00"
                    value={phone}
                    aria-invalid={Boolean(errors.phone)}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${id}-contact`}>
                  Email или Telegram <span className={styles.req}>*</span>
                </label>
                <input
                  id={`${id}-contact`}
                  className={`${styles.input} ${errors.contact ? styles.inputError : ''}`}
                  type="text"
                  placeholder="mail@example.com или @nickname"
                  value={contact}
                  aria-invalid={Boolean(errors.contact)}
                  onChange={(e) => setContact(e.target.value)}
                />
                {errors.contact ? (
                  <span className={styles.fieldError}>{errors.contact}</span>
                ) : (
                  <span className={styles.hint}>Куда вам удобнее получить ответ</span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={`${id}-comment`}>
                  Комментарий к задаче
                </label>
                <textarea
                  id={`${id}-comment`}
                  className={styles.textarea}
                  placeholder="Коротко о проекте: что нужно сделать, есть ли материалы, к какой дате нужен запуск"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <ConsentCheckbox
                id={`${id}-consent`}
                checked={consent}
                onChange={(v) => {
                  setConsent(v)
                  if (v) setErrors((prev) => ({ ...prev, consent: undefined }))
                }}
                error={errors.consent}
              />

              {errors.submit && (
                <p className={styles.formError} role="alert">
                  <AlertCircle size={18} />
                  <span>{errors.submit}</span>
                </p>
              )}

              <button type="submit" className={styles.submit} disabled={loading}>
                {loading ? (
                  <>
                    <span className={styles.loader} aria-hidden="true" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <span>{submitLabel}</span>
                    <ArrowUpRight size={21} />
                  </>
                )}
              </button>

              <span className={styles.hint}>
                Нажимая кнопку, вы соглашаетесь с{' '}
                <Link to="/privacy" target="_blank" rel="noopener">
                  Политикой конфиденциальности
                </Link>
                . Поля со звёздочкой обязательны.
              </span>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
