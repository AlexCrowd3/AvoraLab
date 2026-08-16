import type { CSSVars } from '../../types'
import { useEffect, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import styles from './CaseSearchFilter.module.css'

const PROJECT_TYPES = [
  'Лендинг',
  'Мобильное приложение',
  'Десктоп приложение',
  'Веб-сервис',
  'Telegram-бот',
  'Интернет магазин',
]

const PRICE_MIN = 7000
const PRICE_MAX = 150000

export interface CaseFilters {
  query: string
  selectedTypes: string[]
  priceFrom: number
}

export default function CaseSearchFilter({
  onChange,
}: {
  onChange?: (filters: CaseFilters) => void
}) {
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [priceFrom, setPriceFrom] = useState(PRICE_MIN)

  const hasActiveFilters = selectedTypes.length > 0 || priceFrom > PRICE_MIN

  // Any change to query / selectedTypes / priceFrom should reach the parent —
  // doing it here in one place avoids missing a spot in an individual handler.
  useEffect(() => {
    onChange?.({ query, selectedTypes, priceFrom })
  }, [query, selectedTypes, priceFrom])

  function toggleType(type: string) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  function clearFilters() {
    setSelectedTypes([])
    setPriceFrom(PRICE_MIN)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <div className={styles.searchInput}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Поиск кейсов..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className={styles.clearInput}
              onClick={() => setQuery('')}
              aria-label="Очистить поиск"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          className={`${styles.filtersBtn} ${filtersOpen ? styles.filtersBtnActive : ''}`}
          onClick={() => setFiltersOpen((v) => !v)}
        >
          <SlidersHorizontal size={16} />
          {filtersOpen ? 'Скрыть фильтры' : 'Фильтры'}
        </button>

        {!filtersOpen && hasActiveFilters && (
          <button type="button" className={styles.clearFiltersBtn} onClick={clearFilters}>
            <X size={16} />
            Очистить фильтры
          </button>
        )}
      </div>

      {filtersOpen && (
        <div className={styles.panel}>
          <div className={styles.typeCol}>
            <span className={styles.label}>Тип проекта</span>
            <div className={styles.checkGrid}>
              {PROJECT_TYPES.map((type) => {
                const checked = selectedTypes.includes(type)
                return (
                  <button
                    key={type}
                    type="button"
                    className={`${styles.checkItem} ${checked ? styles.checkItemOn : ''}`}
                    onClick={() => toggleType(type)}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.priceCol}>
            <span className={styles.label}>Цена от</span>
            <div className={styles.priceLabels}>
              <span>{PRICE_MIN.toLocaleString('ru-RU')}</span>
              <span>{PRICE_MAX.toLocaleString('ru-RU')}</span>
            </div>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={1000}
              value={priceFrom}
              onChange={(e) => setPriceFrom(Number(e.target.value))}
              className={styles.slider}
              style={
                {
                  '--fill': `${((priceFrom - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
                } as CSSVars
              }
            />
            <span className={styles.priceValue}>{priceFrom.toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>
      )}
    </div>
  )
}
