import Head from 'next/head'

import { Navbar } from '@/components/Navbar'
import { CallToAction } from '@/components/home/CallToAction'
import { Faqs } from '@/components/home/Faqs'
import { Footer } from '@/components/home/Footer'
import { Header } from '@/components/home/Header'
import { Hero } from '@/components/home/Hero'
import { Pricing } from '@/components/home/Pricing'
import { PrimaryFeatures } from '@/components/home/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/home/SecondaryFeatures'
import { Testimonials } from '@/components/home/Testimonials'

export default function Home() {
  return (
    <>
      <Head>
        <title>Steedos - Build external apps made simple for developers</title>
        <meta
          name="description"
          content="Most bookkeeping software is accurate, but hard to use. We make the opposite trade-off, and hope you don’t get audited."
        />
      </Head>
      <Header/>
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
      <Footer />
    </>
  )
}
