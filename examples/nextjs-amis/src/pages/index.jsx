/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-18 13:28:52
 * @Description: 
 */
import { CallToAction } from '@/components/home/CallToAction'
import { Faqs } from '@/components/home/Faqs'
import { Hero } from '@/components/home/Hero'
import { Pricing } from '@/components/home/Pricing'
import { PrimaryFeatures } from '@/components/home/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/home/SecondaryFeatures'
import { Testimonials } from '@/components/home/Testimonials'
import { HomeLayout } from '@/components/HomeLayout'

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <PrimaryFeatures />
        <SecondaryFeatures />
        <CallToAction />
        <Testimonials />
        <Pricing />
        <Faqs />
      </main>
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return HomeLayout
}