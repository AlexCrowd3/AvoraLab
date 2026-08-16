import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'

import './styles/tokens.css'
import './styles/global.css'

const UTM_STORAGE_KEY = 'utm_data'

try {
  const existingUtm = localStorage.getItem(UTM_STORAGE_KEY)

  if (!existingUtm) {
    const params = new URLSearchParams(window.location.search)

    const utmData = {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
      utm_term: params.get('utm_term'),
      utm_content: params.get('utm_content'),
    }

    const hasUtm = Object.values(utmData).some(Boolean)

    if (hasUtm) {
      localStorage.setItem(
        UTM_STORAGE_KEY,
        JSON.stringify({
          ...utmData,
          first_visit_url: window.location.href,
          saved_at: new Date().toISOString(),
        })
      )
    }
  }
} catch (error) {
  console.error('UTM save error:', error)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)