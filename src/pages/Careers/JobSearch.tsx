import { Search, X } from 'lucide-react'
import styles from './JobSearch.module.css'

export default function JobSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className={styles.searchInput}>
      <Search size={16} />
      <input
        type="text"
        placeholder="Поиск вакансий..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          className={styles.clearInput}
          onClick={() => onChange('')}
          aria-label="Очистить поиск"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
