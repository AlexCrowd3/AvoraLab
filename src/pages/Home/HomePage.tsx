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
  return (
    <>
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
