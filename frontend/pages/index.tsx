import Link from 'next/link'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

import How from '../components/How'

const Homepage: React.FC = () => {
  const user = supabase.auth.user()
  
  const send = () => {
    try {
      const session_auth = JSON.parse(localStorage.getItem('supabase.auth.token') as string)
      if(session_auth.currentSession.access_token) {
        fetch('/api/submissions/create', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Satyam Kulkarni',
            contact_number: '88054950435',
            email: 'string',
            eth_address: 'string',
            sol_address: 'string',
            products: [12, 13],
            page: 1
          }),
          headers: {
            'Bearer-Token': session_auth.currentSession.access_token
          }
        }).then(x => x.json()).then(d => console.log(d)).catch(e => console.error(e))
      }
    } catch (e) {
      console.log('Wait for Loading')
    }
  }
  
  return (
    <>
      <Head>
        <title>WagPay</title>
      </Head>
      <How></How>
    </>
  )
}

export default Homepage