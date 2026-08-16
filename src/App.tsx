import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import ServicesPage from './pages/Services/ServicesPage'
import CasesPage from './pages/Cases/CasesPage'
import CaseDetailPage from './pages/CaseDetail/CaseDetailPage'
import CareersPage from './pages/Careers/CareersPage'
import ContactPage from './pages/Contact/ContactPage'
import ScrollToTop from './ScrollToTop'
import ThanksPage from './pages/ThanksPage/ThanksPage'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/cases" element={<CasesPage />} />
        <Route path="/cases/:slug" element={<CaseDetailPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/thanks" element={<ThanksPage />} />
      </Routes>
    </BrowserRouter>
  )
}
