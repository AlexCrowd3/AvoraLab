/// <reference types="vite/client" />

/**
 * Декларации для файлов, которые импортируются как модули через Vite.
 * Без них TypeScript не знает, что означает `import styles from './X.module.css'`
 * или `import img from './photo.webp'`.
 */

declare module '*.module.css' {
  const classes: Readonly<Record<string, string>>
  export default classes
}

declare module '*.css' {
  const content: string
  export default content
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}
