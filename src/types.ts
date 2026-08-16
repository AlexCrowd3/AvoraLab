import type { CSSProperties } from 'react'

/**
 * React-типы для inline-стилей не допускают произвольные CSS-переменные
 * (--mx, --my и т.п.), хотя браузер их прекрасно понимает. Этот тип
 * разрешает их, сохраняя проверку остальных свойств.
 */
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>
