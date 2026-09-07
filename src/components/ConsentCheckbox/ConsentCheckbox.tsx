import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import styles from './ConsentCheckbox.module.css'

/**
 * Согласие на обработку персональных данных.
 *
 * Используется во всех формах сайта, где собираются имя, телефон, email
 * или Telegram. Галочка НИКОГДА не установлена заранее — начальное
 * значение приходит из состояния формы и всегда false.
 *
 * ВНИМАНИЕ: текст согласия — рабочая формулировка. Перед публикацией
 * замените её на редакцию, согласованную с юристом (см. также
 * src/pages/Privacy/PrivacyPage.tsx).
 */

export const CONSENT_TEXT =
  'Я согласен на обработку персональных данных и ознакомлен с Политикой конфиденциальности'

interface ConsentCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Оформление для тёмного фона. */
  onDark?: boolean
  /** Показать сообщение об ошибке, если пользователь не поставил галочку. */
  error?: string
  id?: string
}

export default function ConsentCheckbox({
  checked,
  onChange,
  onDark = false,
  error,
  id = 'consent',
}: ConsentCheckboxProps) {
  return (
    <div>
      <label
        className={`${styles.wrap} ${onDark ? styles.onDark : ''} ${error ? styles.invalid : ''}`}
        htmlFor={id}
      >
        <span className={styles.box}>
          <input
            id={id}
            className={styles.input}
            type="checkbox"
            checked={checked}
            required
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(e) => onChange(e.target.checked)}
          />
          <Check size={14} strokeWidth={3} className={styles.check} aria-hidden="true" />
        </span>
        <span className={styles.text}>
          Я согласен на обработку персональных данных и ознакомлен с{' '}
          <Link to="/privacy" target="_blank" rel="noopener">
            Политикой конфиденциальности
          </Link>
        </span>
      </label>
      {error && (
        <span className={styles.error} id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
