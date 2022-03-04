import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

import How from '../components/How'
import Features from '../components/features'
import Designed from '../components/designed'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar/Navbar'
import { HeroSection } from '../components/HeroSection/HeroSection'

const Homepage: React.FC = () => {
  return (
    <>
      <Head>
        <title>WagPay</title>
      </Head>
      <div className='w-full h-full'>
        <div className=''>
          <Navbar />
          <HeroSection />

        </div>
        <How></How>
        <Features></Features>
        <Designed></Designed>
        <CTA></CTA>
        <Footer></Footer>
      </div>
    </>
  )
}

export default Homepage