import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import iphoneRockMockup from '../../assets/images/iphone-rock-mockup.png'
import landingPreview from '../../assets/images/landing-preview.webp'
import styles from './PriceCalculator.module.css'

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx0XjPrY42JKvPcuBM7LMhpIVEDoe22eB4OV_ZrHXmyYv58htmeGR5nRitTsx0iwUED2A/exec'

interface Step {
  key: string
  question: string
  options: string[]
}

/** Ответы пользователя: ключ шага -> выбранный вариант. */
type Answers = Record<string, string>

interface Contact {
  name: string
  telegram: string
}

const STEPS: Step[] = [
  {
    key: 'type',
    question: 'Тип проекта',
    options: [
      'Лендинг / промо-сайт',
      'Интернет-магазин',
      'Веб-сервис / личный кабинет',
      'Telegram-бот',
      'Мобильное / десктоп-приложение',
    ],
  },
  {
    key: 'budget',
    question: 'Бюджет проекта',
    options: ['До 30 000 ₽', '30 000–100 000 ₽', '100 000–300 000 ₽', 'От 300 000 ₽'],
  },
  {
    key: 'timeline',
    question: 'Сроки запуска',
    options: ['Срочно, до 2 недель', '2–4 недели', '1–2 месяца', 'Сроки не горят'],
  },
  {
    key: 'needs',
    question: 'Что важно учесть?',
    options: [
      'Есть готовый дизайн',
      'Нужен дизайн с нуля',
      'Нужна интеграция с CRM / оплатой',
      'Нужна поддержка после запуска',
    ],
  },
]

const TOTAL_STEPS = STEPS.length + 1 // + contact step

export default function PriceCalculator() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Answers>({ type: 'Лендинг / промо-сайт' })
  const [contact, setContact] = useState<Contact>({ name: '', telegram: '' })
  const [submitted, setSubmitted] = useState(false)
  const { containerRef, isVisible } = useRevealOnScroll(1)
  const [loading, setLoading] = useState(false)

  const isQuestionStep = step <= STEPS.length
  const current = STEPS[step - 1]

  const selectOption = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }))
  }

  const canAdvance = isQuestionStep ? Boolean(answers[current.key]) : true

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)

    try {
      const utm = JSON.parse(
        localStorage.getItem('utm_data') || 'null'
      )

      const payload = {
        date: new Date().toLocaleString('ru-RU'),

        utm: utm
          ? Object.entries(utm)
            .filter(
              ([key, value]) =>
                key.startsWith('utm_') && value
            )
            .map(([key, value]) => `${key}=${value}`)
            .join(' | ')
          : '',

        type: answers.type || '',
        budget: answers.budget || '',
        timeline: answers.timeline || '',
        needs: answers.needs || '',

        contact: contact.telegram,
        name: contact.name,
      }

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      setSubmitted(true)
    } catch (error) {
      console.error(error)
      alert('Ошибка отправки')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.section} id="calculator">
      <div className={styles.bgArt} aria-hidden="true">
        <img src={iphoneRockMockup} alt="" loading="lazy" />
        <img src={landingPreview} alt="" loading="lazy" />
      </div>

      <div className={`container ${styles.inner}`}>
        <div className={styles.heading}>
          <h2 className={styles.title}>Узнайте цену за 1 минуту</h2>
          <p className={styles.subtitle}>
            Ответьте на 4 вопроса — получите ориентировочную смету. Точный расчёт пришлём в
            Telegram после заявки.
          </p>
        </div>

        <div
          className={`${styles.panel} reveal ${isVisible(0) ? 'reveal-visible' : ''}`}
          ref={containerRef}
        >
          {!submitted ? (
            <>
              <ol className={styles.stepper} aria-label="Прогресс заполнения">
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
                  const n = i + 1
                  const done = n < step
                  const active = n === step
                  return (
                    <li key={n} className={styles.stepperItem}>
                      <span
                        className={`${styles.stepDot} ${active ? styles.stepDotActive : ''} ${done ? styles.stepDotDone : ''
                          }`}
                      >
                        {done ? <Check size={14} /> : n}
                      </span>
                      {n < TOTAL_STEPS && (
                        <span className={`${styles.stepLine} ${done ? styles.stepLineDone : ''}`} />
                      )}
                    </li>
                  )
                })}
              </ol>

              {isQuestionStep ? (
                <>
                  <h3 className={styles.stepTitle}>
                    Шаг {step} из {TOTAL_STEPS} — {current.question}
                  </h3>
                  <div className={styles.options}>
                    {current.options.map((opt) => {
                      const selected = answers[current.key] === opt
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => selectOption(current.key, opt)}
                          className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                          aria-pressed={selected}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>

                  <div className={styles.navRow}>
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={step === 1}
                      className={styles.backBtn}
                    >
                      <ArrowLeft size={20} />
                      Назад
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!canAdvance}
                      className={styles.nextBtn}
                    >
                      Далее
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </>
              ) : (
                <form className={styles.contactForm} onSubmit={handleSubmit}>
                  <h3 className={styles.stepTitle}>
                    Шаг {step} из {TOTAL_STEPS} — Куда прислать расчёт?
                  </h3>
                  <div className={styles.fields}>
                    <input
                      required
                      type="text"
                      placeholder="Ваше имя"
                      value={contact.name}
                      onChange={(e) => setContact({ ...contact, name: e.target.value })}
                      className={styles.input}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Telegram или телефон"
                      value={contact.telegram}
                      onChange={(e) => setContact({ ...contact, telegram: e.target.value })}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.navRow}>
                    <button type="button" onClick={handleBack} className={styles.backBtn}>
                      <ArrowLeft size={20} />
                      Назад
                    </button>
                    <button
                      type="submit"
                      className={styles.nextBtn}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className={styles.loader}></span>
                          Отправка...
                        </>
                      ) : (
                        <>
                          Отправить заявку
                          <ArrowRight size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className={styles.successState}>
              <span className={styles.successIcon}>
                <Check size={32} />
              </span>
              <h3 className={styles.stepTitle}>Заявка отправлена!</h3>
              <p className={styles.successText}>
                Спасибо, {contact.name || 'мы получили ваши ответы'}! Пришлём расчёт стоимости в
                Telegram в течение дня.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
