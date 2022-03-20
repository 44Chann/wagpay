// claim imports
import { useRouter } from 'next/router'
import { useConnect, useAccount } from 'wagmi'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { WalletConnectButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'
import { useSignMessage } from 'wagmi'
// claim imports end

import {
  ViewGridIcon,
  CreditCardIcon,
  BellIcon,
  TerminalIcon,
  GlobeIcon,
  DocumentTextIcon,
} from '@heroicons/react/outline'
import { ChevronRightIcon, ExternalLinkIcon } from '@heroicons/react/solid'

import Head from 'next/head'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

import Footer from '../components/Footer'
import Navbar from '../components/Navbar/Navbar'

const features = [
  {
    name: 'Payment Pages',
    description:
      'Easily receive payments in multiple cryptocurrencies like ETH, USDC, SOL and more coming soon',
    icon: DocumentTextIcon,
  },
  {
    name: 'International Payments',
    description:
      'Receive Cryptocurrencies from anywhere in the world with 0 fees and *superfast speed',
    icon: GlobeIcon,
  },
  {
    name: 'Powerful Dashboard to track payments',
    description:
      'WagPay provides a very powerful dashboard with each and every data point that your business needs',
    icon: ViewGridIcon,
  },
  {
    name: 'Zero Fees & No Credit Card Required',
    description:
      "WagPay doesn't charge any fees to access dashboard or on your cryptocurrency payments",
    icon: CreditCardIcon,
  },
  {
    name: 'Great SDK',
    description:
      'Get Access to a powerful SDK with which you can directly integrate cryptocurrencies payments from your own store (coming soon)',
    icon: TerminalIcon,
  },
  {
    name: 'Receive Notifications',
    description:
      'Receive Emails on every successful purchase with a generated invoice',
    icon: BellIcon,
  },
]

const blogPosts = [
  {
    id: 1,
    title: 'Gauranteed Safety',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    preview:
      'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
  },
  {
    id: 2,
    title: 'Gauranteed Safety',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    preview:
      'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
  },
  {
    id: 3,
    title: 'Gauranteed Safety',
    href: '#',
    imageUrl:
      'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    preview:
      'Millions of businesses of all sizes—from startups to large enterprises—use Wagpay’s software and APIs to accept payments, send payouts, and manage their businesses online.',
  },
]

const Homepage: React.FC = () => {
  toast.configure()
  const [{ data: connectData, error: connectError }, connect] = useConnect()
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })
  const [{ data, error, loading }, signMessage] = useSignMessage({
    message: 'gm! \n\n Join WagPay Waitlist!',
  })

  const connectSOL = async () => {
    try {
      await window.solana.connect()
      setSOL(window.solana.publicKey.toString())
    } catch (e) {
      console.log(e)
    }
  }

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [eth, setETH] = useState('')
  const [sol, setSOL] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [available, setAvailable] = useState('')

  const { query } = useRouter()
  useEffect(() => {
    console.log(query)
    setUsername(query.username as string)
  }, [query])

  useEffect(() => {
    if (accountData && accountData.address) setETH(accountData.address)
  }, [accountData])

  useEffect(() => console.log(eth), [eth])
  useEffect(() => console.log(sol), [sol])

  const submit = async () => {
    await signMessage()

    let data = {
      username: username,
      eth_address: eth,
      sol_address: sol,
      email: email,
    }

    console.log(data)

    let url = `/api/user/create`
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        toast.success('Successfully Joined the Waitlist')
      })
      .catch((e) => {
        toast.error('Email / Username is already registered')
      })
  }

  const checkUsername = async () => {
    let url = `/api/user/check_username?username=${username}`

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data['is_available']) {
          toast.success('Its Available')
        } else {
          toast.error('Not Available')
        }
      })
  }
  useEffect(() => {
    console.log(supabase.auth.user())
  }, [])

  return (
    <>
      <Head>
        <title>WagPay</title>
      </Head>
      <div className="h-full w-full font-inter">
        <Navbar />
        <main>
          <div className="bg-gray-900 pt-10 sm:pt-16 lg:overflow-hidden lg:pt-8 lg:pb-14 ">
            <div className="mx-auto max-w-7xl lg:px-8">
              <div className="lg:grid lg:grid-cols-2 lg:gap-8">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:flex lg:items-center lg:px-0 lg:text-left">
                  <div className="lg:py-24">
                    <a
                      href="#"
                      className="inline-flex items-center rounded-full bg-black p-1 pr-2 text-white hover:text-gray-200 sm:text-base lg:text-sm xl:text-base"
                    >
                      <span className="rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 px-3 py-0.5 text-xs font-semibold uppercase leading-5 tracking-wide text-white">
                        Claim your Username
                      </span>
                      <a href="#claim" className="ml-4 text-sm">
                        Click here
                      </a>
                      <ChevronRightIcon
                        className="ml-2 h-5 w-5 text-gray-500"
                        aria-hidden="true"
                      />
                    </a>
                    <h1 className="mt-4 space-y-2 font-jakarta text-4xl font-black tracking-tight text-white sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                      <span className="block">
                        Next generation payment gateway
                      </span>
                      <span className="block bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text pb-3 text-transparent sm:pb-5">
                        for the internet
                      </span>
                    </h1>
                    <p className="text-base text-gray-300 sm:text-xl lg:text-lg xl:text-xl">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Architecto enim eos nesciunt atque ipsam nobis est?
                      Possimus dolore sed explicabo?
                    </p>
                    <div className="mt-10 sm:mt-12">
                      <form
                        action="#"
                        className="sm:mx-auto sm:max-w-xl lg:mx-0"
                      >
                        <div className="sm:flex">
                          <div className="min-w-0 flex-1">
                            <label htmlFor="username" className="sr-only">
                              Email address
                            </label>
                            <input
                              id="username"
                              type="text"
                              placeholder="@username"
                              className="block w-full rounded-md border-0 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                            />
                          </div>
                          <div className="mt-3 sm:mt-0 sm:ml-3">
                            <button
                              type="submit"
                              className="block w-full rounded-md bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 py-3 px-6 font-medium text-white shadow hover:from-rose-500 hover:via-fuchsia-600 hover:to-indigo-600 focus:outline-none"
                            >
                              Sign up
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-12 -mb-16 sm:-mb-48 lg:relative lg:m-0">
                  <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                    <img
                      className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                      src="/hero.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature section with screenshot */}
          <div className="relative bg-gray-50 pt-16 sm:pt-24 lg:pt-32">
            <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
              <div>
                <h2 className="text-base font-semibold uppercase tracking-wider text-fuchsia-600">
                  Painless
                </h2>
                <p className="mt-2 font-jakarta text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  WagPay Dashboard - Managing Payments made easy
                </p>
                <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
                  Phasellus lorem quam molestie id quisque diam aenean nulla in.
                  Accumsan in quis quis nunc, ullamcorper malesuada. Eleifend
                  condimentum id viverra nulla.
                </p>
              </div>
              <div className="mt-12 -mb-10 sm:-mb-24 lg:-mb-80">
                <img
                  className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
                  src={'/images/temp.jpg'}
                  alt=""
                />
              </div>
            </div>
          </div>

          {/* Feature section with grid */}
          <div className="relative bg-white py-16 sm:py-24 lg:py-32">
            <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
              <h2 className="text-base font-semibold uppercase tracking-wider text-fuchsia-600">
                Accept Crypto Fastly
              </h2>
              <p className="mt-2 font-jakarta text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to get started with crypto payments
              </p>
              <p className="mx-auto mt-5 max-w-prose font-inter text-xl text-gray-500">
                At WagPay, We have every feature that you will need to accept
                payments in crypto and track them, more features coming soon!
              </p>
              <div className="mt-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {features.map((feature) => (
                    <div key={feature.name} className="pt-6">
                      <div className="flow-root h-56 rounded-lg bg-gray-50 px-6 pb-8 font-inter">
                        <div className="-mt-6">
                          <div>
                            <span className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 p-3 shadow-lg">
                              <feature.icon
                                className="h-6 w-6 text-white"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                          <h3 className="mt-8 text-lg font-bold tracking-tight text-gray-900">
                            {feature.name}
                          </h3>
                          <p className="mt-5 text-base text-gray-500">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial section */}
          <div
            id="claim"
            className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 pb-16 lg:relative lg:z-10 lg:pb-0"
          >
            <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-8 lg:px-8">
              <div className="relative lg:-my-8">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1/2 bg-white lg:hidden"
                />
                <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:h-full lg:p-0">
                  <div className="aspect-w-10 aspect-h-6 sm:aspect-w-16 sm:aspect-h-7 lg:aspect-none overflow-hidden rounded-xl shadow-xl lg:h-full">
                    <div className="relative bg-white object-cover lg:h-full lg:w-full">
                      <div className="z-50 flex h-full w-full flex-col items-center justify-center space-y-5 bg-[#6C7EE1]/25 p-5">
                        <h1 className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 bg-clip-text py-3 px-4 text-3xl font-bold text-transparent">
                          Claim Username
                        </h1>
                        <input
                          type="email"
                          placeholder="example@email.com"
                          className="w-full rounded-xl border-0 py-4 pl-4 text-sm font-semibold opacity-80 outline-none"
                          value={email}
                          onChange={(e: any) => setEmail(e.target.value)}
                        />
                        <div className="flex w-full justify-between rounded-xl bg-white  opacity-80">
                          <input
                            type="text"
                            placeholder="@username"
                            className="w-full rounded-xl border-0 py-4 pl-4 text-sm font-semibold opacity-80 outline-none"
                            value={username}
                            onChange={(e: any) => setUsername(e.target.value)}
                          />
                          <button
                            className="w-1/3 rounded-xl bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 py-3 px-4 font-medium text-white shadow hover:from-rose-500 hover:via-fuchsia-600 hover:to-indigo-600 focus:outline-none"
                            onClick={() => checkUsername()}
                          >
                            Check
                          </button>
                        </div>
                        {eth === '' ? (
                          <button
                            className="border-3 flex w-full items-center justify-between rounded-xl border border-white p-3  font-semibold"
                            onClick={() => setIsOpen(true)}
                          >
                            <span>Connect Ethereum Wallet</span>
                            <img src="/eth.png" alt="" className="items-end" />
                          </button>
                        ) : (
                          <p className="w-20 truncate text-center lg:w-full">
                            {eth}
                          </p>
                        )}
                        <div
                          className={
                            (isOpen ? '' : 'hidden') +
                            ' fixed top-1/2 left-1/2 z-50 flex h-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center space-y-5 rounded-xl bg-white text-white transition-opacity duration-1000 ease-out'
                          }
                        >
                          <button
                            className="absolute top-5 right-5 text-black"
                            onClick={() => setIsOpen(false)}
                          >
                            X
                          </button>
                          <h2 className="text-2xl font-bold text-black">
                            Connect Your Wallet
                          </h2>
                          <div>
                            {connectData.connectors.map((connector) => (
                              <button
                                key={connector.id}
                                onClick={async () => {
                                  await connect(connector)
                                  console.log(accountData)
                                  setETH(accountData?.address as string)
                                }}
                                className="m-3 flex w-64 items-center justify-center space-x-3 rounded-xl bg-black p-3"
                              >
                                {connector.name.toLowerCase() ===
                                  'metamask' && (
                                  <img
                                    className="w-10"
                                    src="/MetaMask_Fox.svg"
                                  />
                                )}
                                {connector.name.toLowerCase() ===
                                  'walletconnect' && (
                                  <img
                                    className="w-10"
                                    src="/walletconnect-circle-blue.svg"
                                  />
                                )}
                                {connector.name.toLowerCase() ===
                                  'coinbase wallet' && (
                                  <img className="w-10" src="/coinbase.png" />
                                )}
                                <span>{connector.name}</span>
                                {!connector.ready && ' (unsupported)'}
                              </button>
                            ))}
                          </div>
                        </div>
                        {sol === '' ? (
                          <button
                            onClick={async () => connectSOL()}
                            className="border-3 flex w-full items-center justify-between rounded-xl border border-white p-3  font-semibold"
                          >
                            Connect Sol Wallet
                            <img src="/sol.png" alt="" />
                          </button>
                        ) : (
                          <p className="w-20 truncate text-center lg:w-full">
                            {sol}
                          </p>
                        )}
                        <button
                          onClick={() => submit()}
                          className="w-full rounded-xl bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 py-3 px-4 font-medium text-white shadow hover:from-rose-500 hover:via-fuchsia-600 hover:to-indigo-600 focus:outline-none"
                        >
                          Claim
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 lg:col-span-2 lg:m-0 lg:pl-8">
                <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0 lg:py-20">
                  <blockquote>
                    <div>
                      <svg
                        className="h-12 w-12 text-white opacity-25"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="mt-6 text-2xl font-medium text-white">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed urna nulla vitae laoreet augue. Amet feugiat est
                        integer dolor auctor adipiscing nunc urna, sit.
                      </p>
                    </div>
                    <footer className="mt-6">
                      <p className="text-base font-medium text-white">v3n0m</p>
                      <p className="text-base font-medium text-cyan-100">
                        CEO at Azuki
                      </p>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          {/* Blog section */}
          <div className="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
            <div className="relative">
              <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-base font-semibold uppercase tracking-wider text-fuchsia-600">
                  Learn
                </h2>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                  How WagPay Works?
                </p>
                <p className="mx-auto mt-5 max-w-prose text-xl text-gray-500">
                  Phasellus lorem quam molestie id quisque diam aenean nulla in.
                  Accumsan in quis quis nunc, ullamcorper malesuada. Eleifend
                  condimentum id viverra nulla.
                </p>
              </div>
              <div className="mx-auto mt-12 grid max-w-md gap-8 px-4 sm:max-w-lg sm:px-6 lg:max-w-7xl lg:grid-cols-3 lg:px-8">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex flex-col overflow-hidden rounded-lg shadow-lg"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="h-48 w-full object-cover"
                        src={post.imageUrl}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between bg-white p-6">
                      <div className="flex-1">
                        <a href={post.href} className="mt-2 block">
                          <p className="text-xl font-semibold text-gray-900">
                            {post.title}
                          </p>
                          <p className="mt-3 text-base text-gray-500">
                            {post.preview}
                          </p>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative bg-gray-900">
            <div className="relative h-56 bg-indigo-600 sm:h-72 md:absolute md:left-0 md:h-full md:w-1/2">
              <img
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&sat=-100"
                alt=""
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 mix-blend-multiply"
              />
            </div>
            <div className="relative mx-auto max-w-md px-4 py-12 sm:max-w-7xl sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-32">
              <div className="md:ml-auto md:w-1/2 md:pl-10">
                <h2 className="text-base font-semibold uppercase tracking-wider text-gray-300">
                  Need Support
                </h2>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  We’re here to help
                </p>
                <p className="mt-3 text-lg text-gray-300">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
                  egestas tempus tellus etiam sed. Quam a scelerisque amet
                  ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
                  quisque ut interdum tincidunt duis.
                </p>
                <div className="mt-8">
                  <div className="inline-flex rounded-md shadow">
                    <a
                      href="#"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                    >
                      Get Help
                      <ExternalLinkIcon
                        className="-mr-1 ml-3 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer></Footer>
      </div>
    </>
  )
}

export default Homepage
