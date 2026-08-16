import { useEffect, useRef, useState } from 'react'
import type React from 'react'

const MOBILE_BREAKPOINT = 700

/**
 * useRevealOnScroll — переиспользуемый хук для эффекта "проявления" карточек
 * при попадании в область видимости во время скролла.
 *
 * По требованию клиента scroll-reveal анимация отключена на мобильной версии
 * (ширина экрана <= 700px): там карточки показываются сразу, статично.
 * На планшетах, ноутбуках и десктопе анимация работает.
 *
 * @param {number} count — сколько карточек анимировать
 * @param {number} staggerMs — задержка между карточками (мс), по умолчанию 90
 * @param {number} threshold — доля видимости контейнера для срабатывания (0-1)
 * @returns {{ containerRef, isVisible: (i: number) => boolean }}
 */
interface RevealOptions {
  /** Задержка между появлением соседних карточек, мс */
  staggerMs?: number
}

interface RevealResult<T extends HTMLElement = HTMLDivElement> {
  containerRef: React.RefObject<T | null>
  isVisible: (index: number) => boolean
}

export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(
  count: number,
  { staggerMs = 90 }: RevealOptions = {}
): RevealResult<T> {
  const containerRef = useRef<T>(null)
  const [visible, setVisible] = useState<boolean[]>(() => new Array(count).fill(false))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // На телефоне анимации появления отключены — карточки сразу видны.
    const isPhone = window.innerWidth <= MOBILE_BREAKPOINT
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isPhone || prefersReduced) {
      setVisible(new Array(count).fill(true))
      return
    }

    // rootMargin (not threshold) is what makes this robust for containers of
    // any height, including very tall ones spanning several stacked cards:
    // it fires as soon as the container's TOP EDGE crosses 85% down the
    // viewport, rather than requiring some percentage of the whole (possibly
    // huge) container to be on screen — a percentage-of-self threshold can
    // fail to ever cross 0.15 until the user has already scrolled past most
    // of the content.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          reveal()
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 }
    )
    observer.observe(el)

    // Safety net: whatever the reason (odd layout, a fast programmatic
    // scroll in a test, a browser quirk), content must never stay stuck
    // invisible forever — force it visible after a few seconds regardless.
    const fallback = setTimeout(reveal, 4000)

    function reveal() {
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          setVisible((prev) => {
            const next = [...prev]
            next[i] = true
            return next
          })
        }, i * staggerMs)
      }
      observer.disconnect()
      clearTimeout(fallback)
    }

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return { containerRef, isVisible: (i) => visible[i] }
}
