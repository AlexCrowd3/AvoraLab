import Seo, { SITE_URL, breadcrumbsJsonLd } from '../../components/Seo/Seo'
import { SERVICES } from '../../data/services'
import Header from '../../components/Header/Header'
import Hero from '../../components/Hero/Hero'
import WhatWeBuild from '../../components/WhatWeBuild/WhatWeBuild'
import ExpressWork from '../../components/ExpressWork/ExpressWork'
import Reviews from '../../components/Reviews/Reviews'
import WhyUs from '../../components/WhyUs/WhyUs'
import PriceCalculator from '../../components/PriceCalculator/PriceCalculator'
import Process from '../../components/Process/Process'
import Reliability from '../../components/Reliability/Reliability'
import FinalCta from '../../components/FinalCta/FinalCta'
import Footer from '../../components/Footer/Footer'

export default function HomePage() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Avora Lab',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description:
      'Веб-студия полного цикла: лендинги, интернет-магазины, веб-сервисы, Telegram-боты и мобильные приложения под ключ.',
    email: 'avoralab86@gmail.com',
    telephone: '+7 (931) 979-27-64',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Санкт-Петербург',
      addressCountry: 'RU',
    },
    sameAs: ['https://t.me/RAFF_LEMs'],
    makesOffer: SERVICES.map((s) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: s.shortTitle,
        url: `${SITE_URL}/services/${s.slug}`,
      },
    })),
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Avora Lab',
    url: SITE_URL,
    inLanguage: 'ru-RU',
  }

  return (
    <>
      <Seo
        title="Avora Lab — разработка сайтов, интернет-магазинов и приложений"
        description="Студия разработки полного цикла: лендинги от 24 900 ₽, интернет-магазины, веб-сервисы, Telegram-боты и мобильные приложения. Работаем по договору, с фиксированными сроками."
        path="/"
        jsonLd={[
          organizationJsonLd,
          websiteJsonLd,
          breadcrumbsJsonLd([{ name: 'Главная', path: '/' }]),
        ]}
      />
      <Header />
      <main>
        <Hero />
        <WhatWeBuild />
        <ExpressWork />
        <Reviews />
        <WhyUs />
        <PriceCalculator />
        <Process />
        <Reliability />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
