import React from 'react'
import Hero from '@/components/home-component/Hero'
import OurServices from '@/components/home-component/OurServices'
import HomeAbout from '@/components/home-component/HomeAbout'
import FeaturedProjects from '@/components/home-component/FeaturedProjects'
import TestimonialsSection from '@/components/home-component/TestimonialsSection'
import CallToAction from '@/components/home-component/CallToAction'
import RequestQuote from '@/components/home-component/RequestQuote'
import ClientsLogoSlider from '@/components/home-component/ClientsLogoSlider'
import SubscribeToNewsletter from '@/components/home-component/SubscribeToNewsletter'
import ShopByCategory from '@/components/home-component/ShopByCategory'
import TopSellingItems from '@/components/home-component/TopSellingItems'
import FeaturedProducts from '@/components/home-component/FeaturedProducts'
import ShopByProducts from '@/components/home-component/ShopByProducts'
import ProductSearch from '@/components/home-component/ProductSearch'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ShopByCategory />
      <TopSellingItems />
      <FeaturedProducts />
      <ShopByProducts />
      <HomeAbout />
      <CallToAction />
      <SubscribeToNewsletter />
    </>
  )
}
