import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

import How from '../components/How'
import Features from '../components/features'
import Designed from '../components/designed'

const Points = [
  {
    invert: true,
    for: 'For Businesses',
    title: 'The world’s most powerful and easy-to-use APIs',
    desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
    point1: 'Point 1',
    point1desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
    point2: 'Point 1',
    point2desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
  },
  {
    invert: false,
    for: 'For SMBs',
    title: 'The world’s most powerful and easy-to-use APIs',
    desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
    point1: 'Point 1',
    point1desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
    point2: 'Point 1',
    point2desc: 'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs',
  }
]

const Homepage: React.FC = () => {  
  return (
    <>
      <Head>
        <title>WagPay</title>
      </Head>
      <div className='w-full h-full'>
        <How></How>
        <Features></Features>
        <Designed></Designed>
      </div>
    </>
  )
}

export default Homepage