/**
 * Отправка заявок. Единая точка для всех форм сайта, чтобы поля и endpoint
 * не расползались по компонентам.
 *
 * Endpoint — тот же Google Apps Script, что уже использовался на странице
 * «Контакты». Если заявки будут уходить на собственный backend, достаточно
 * поменять адрес здесь.
 */
export const LEADS_ENDPOINT =
  'https://script.google.com/macros/s/AKfycbweW73C-C9D8yhzMm7a9wTmq0LDvZXjqBqWla1XQP-DTRyxRmE4Rs2Gcu9EcamrAaGTCw/exec'

/** UTM-метки, сохранённые при первом заходе на сайт. */
export function getUtmString(): string {
  try {
    const utm = JSON.parse(localStorage.getItem('utm_data') || 'null')
    if (!utm) return ''
    return Object.entries(utm)
      .filter(
        ([key, value]) => (key.startsWith('utm_') || key === 'yclid') && value
      )
      .map(([key, value]) => `${key}=${value}`)
      .join(' | ')
  } catch {
    return ''
  }
}

export interface LeadPayload {
  /** Какая форма отправила заявку: contact | service | calculator */
  formType: string
  /** Название выбранной услуги — подставляется автоматически со страницы услуги. */
  service?: string
  name?: string
  phone?: string
  contact?: string
  comment?: string
  /** Факт согласия на обработку персональных данных. */
  consent?: string
  [key: string]: string | undefined
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  await fetch(LEADS_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: new Date().toLocaleString('ru-RU'),
      utm: getUtmString(),
      pageUrl: typeof location !== 'undefined' ? location.href : '',
      ...payload,
    }),
  })
}
