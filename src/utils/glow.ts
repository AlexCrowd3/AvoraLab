import type { MouseEvent } from 'react'

/**
 * Записывает позицию курсора внутри элемента в CSS-переменные --mx/--my,
 * чтобы CSS мог рисовать «свечение», следующее за мышью.
 *
 * @param asPercent — писать координаты в процентах вместо пикселей
 */
export function trackGlow(e: MouseEvent<HTMLElement>, asPercent = false) {
  const el = e.currentTarget
  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  if (asPercent) {
    el.style.setProperty('--mx', `${(x / rect.width) * 100}%`)
    el.style.setProperty('--my', `${(y / rect.height) * 100}%`)
  } else {
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
  }
}
