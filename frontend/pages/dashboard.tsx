import Overview from '../components/Dashboard/Overview'
import Pages from '../components/Dashboard/Pages'
import Transactions from '../components/Dashboard/Transactions'
import Products from '../components/Dashboard/Products'
import Settings from '../components/Dashboard/Settings'
import { Fragment, useEffect, useLayoutEffect, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  CollectionIcon,
  CogIcon,
  CreditCardIcon,
  HomeIcon,
  MenuAlt1Icon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  ScaleIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  XIcon,
} from '@heroicons/react/outline'
import {
  CashIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  OfficeBuildingIcon,
  SearchIcon,
  PlusIcon
} from '@heroicons/react/solid'
import { supabase } from '../supabase'
import { User } from './api/userType'
import PageHeader from '../components/Dashboard/PageHeader'
import { useRouter } from 'next/router'

const navigation = [
  { name: 'Overview', comp_name: 'overview', icon: HomeIcon, current: true },
  { name: 'Pages', comp_name: 'pages', icon: CollectionIcon, current: false },
  { name: 'Products', comp_name: 'products', icon: ShoppingCartIcon, current: false },
  { name: 'Transactions', comp_name: 'transactions', icon: CreditCardIcon, current: false },
  { name: 'Settings', comp_name: 'settings', icon: CogIcon, current: false },
]

const secondaryNavigation = [
  { name: 'Help', href: '#', icon: QuestionMarkCircleIcon },
  { name: 'Privacy', href: '#', icon: ShieldCheckIcon },
]

const cards = [
  { name: 'Total visits', href: '#', icon: TrendingUpIcon, amount: '0' },
  {
    name: 'Products Sold',
    href: '#',
    icon: TrendingUpIcon,
    amount: '0',
  },
  { name: 'Earned', href: '#', icon: CashIcon, amount: '0' },
  { name: 'Pages', href: '#', icon: CollectionIcon, amount: '0' },
  // More items...
]

const transactions = [
  {
    id: 1,
    productName: '2 Kg Ganja',
    pageName: 'Page Name',
    href: '#',
    amount: '$20,000',
    currency: 'USD',
    status: 'success',
    date: 'July 11, 2020',
    datetime: '2020-07-11',
  },
  {
    id: 2,
    productName: '2 Kg Ganja',
    pageName: 'Page Name',
    href: '#',
    amount: '$20,000',
    currency: 'USD',
    status: 'success',
    date: 'July 11, 2020',
    datetime: '2020-07-11',
  },
  {
    id: 3,
    productName: '2 Kg Ganja',
    pageName: 'Page Name',
    href: '#',
    amount: '$20,000',
    currency: 'USD',
    status: 'success',
    date: 'July 11, 2020',
    datetime: '2020-07-11',
  },
  // More transactions...
]

const statusStyles = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-gray-100 text-gray-800',
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}


export default function Dashboard() {
  const { push } = useRouter()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('overview')
  const [user, setUser] = useState<User>({} as User)
	const [visits, setVisits] = useState(0)
	const [money, setMoney] = useState('$0')
	const [sold, setSold] = useState(0)
  const [running, setRunning] = useState(false)

  useLayoutEffect(() => {
    try {
      const user = supabase.auth.user()
      console.log('user1')
      if(!user) {
        console.log('user')
        push('/auth')
        return
      }
      console.log('user2')
    } catch (e) {
      push('/auth')
      console.log('not logged in')
      return
    }
    setRunning(true)
  }, [])

  useEffect(() => console.log(running, 'running'), [running])

  const getMoneyEarned = async () => {
    if(running) {
      const data = await fetch('/api/products/money_earned', {
        headers: {
          'bearer-token': supabase.auth.session()?.access_token as string
        }
      })
      const res = await data.json()
      cards[2].amount = '$' + res
      setMoney('$' + res)
    }
  }

  const totalProductSold = async () => {
    if(running) {
      const data = await fetch('/api/products/product_sold', {
        headers: {
          'bearer-token': supabase.auth.session()?.access_token as string
        }
      })
      const res = await data.json()
      cards[1].amount = res
      setSold(res)
    }
  }

  const totalVisits = async () => {
    if(running) {
      const data = await fetch('/api/pages/visits', {
        headers: {
          'bearer-token': supabase.auth.session()?.access_token as string
        }
      })
      const res = await data.json()
      cards[0].amount = res
      console.log(cards[0])
      setVisits(res)
    }
  }

  const totalPages = async () => {
    if(running) {
      const data = await fetch('/api/pages/number_of_pages', {
        headers: {
          'bearer-token': supabase.auth.session()?.access_token as string
        }
      })
      const res = await data.json()
      cards[3].amount = res
      setVisits(res)
    }
  }

  useEffect(() => {
    if(running) {
      getMoneyEarned()
      totalProductSold()
      totalVisits()
      totalPages()
    }
  }, [running])

  const changeTab = (nextTab: string, nextId: number) => {
    const index = navigation.map((e) => {return e.comp_name}).indexOf(currentTab)
    if(index === -1) return
    navigation[index].current = false
    navigation[nextId].current = true
    setCurrentTab(nextTab)
  }

  const getUser = async () => {
    const data = await fetch(`/api/user/get?email=${supabase.auth.user()?.email}`)
    const res = await data.json()

    setUser(res)
  }

  useEffect(() => {
    getUser()
  }, [supabase.auth.user()])

  return (
    <>
      <div className="min-h-full font-urban">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-cyan-700 pt-5 pb-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex flex-shrink-0 items-center px-4">
                  <h1 className="font-inter text-2xl font-extrabold text-white">
                    WagPay
                  </h1>
                </div>
                <nav
                  className="mt-5 h-full flex-shrink-0 divide-y divide-cyan-800 overflow-y-auto"
                  aria-label="Sidebar"
                >
                  <div className="space-y-1 px-2">
                    {navigation.map((item, idx) => (
                      <a
                        key={item.name}
                        onClick={() => changeTab(item.comp_name, idx)}
                        className={classNames(
                          item.current
                            ? 'bg-cyan-800 text-white'
                            : 'text-cyan-100 hover:bg-cyan-600 hover:text-white',
                          'group flex items-center rounded-md px-2 py-2 text-base font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        <item.icon
                          className="mr-4 h-6 w-6 flex-shrink-0 text-cyan-200"
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="mt-6 pt-6">
                    <div className="space-y-1 px-2">
                      {secondaryNavigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-cyan-100 hover:bg-cyan-600 hover:text-white"
                        >
                          <item.icon
                            className="mr-4 h-6 w-6 text-cyan-200"
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </nav>
              </div>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto bg-cyan-700 pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-2xl font-extrabold text-white">WagPay</h1>
            </div>
            <nav
              className="mt-5 flex flex-1 flex-col divide-y divide-cyan-800 overflow-y-auto"
              aria-label="Sidebar"
            >
              <div className="space-y-1 px-2">
                {navigation.map((item, idx) => (
                  <a
                    key={item.name}
                    onClick={() => changeTab(item.comp_name, idx)}
                    className={classNames(
                      item.current
                        ? 'bg-cyan-800 text-white'
                        : 'text-cyan-100 hover:bg-cyan-600 hover:text-white',
                      'group flex items-center cursor-pointer rounded-md px-2 py-2 text-sm font-medium leading-6'
                    )}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <item.icon
                      className="mr-4 h-6 w-6 flex-shrink-0 text-cyan-200"
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="mt-6 pt-6">
                <div className="space-y-1 px-2">
                  {secondaryNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-sm font-medium leading-6 text-cyan-100 hover:bg-cyan-600 hover:text-white"
                    >
                      <item.icon
                        className="mr-4 h-6 w-6 text-cyan-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:border-none">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuAlt1Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Search bar */}
            <div className="flex flex-1 justify-end px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>
                        gm, {user.username}
                      </span>
                      <ChevronDownIcon
                        className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }: any) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: any) => (
                          <a
                            href="#"
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }: any) => (
                          <button
                            onClick={() => supabase.auth.signOut()}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1 pb-8">
            {/* Page header */}
            <PageHeader user={user} />
            {currentTab === 'overview' && <Overview cards={cards} />}
            {currentTab === 'pages' && <Pages cards={cards} />}
            {currentTab === 'transactions' && <Transactions cards={cards} />}
            {currentTab === 'products' && <Products cards={cards} />}
            {currentTab === 'settings' && <Settings cards={cards} transactions={transactions} />}
          </main>
        </div>
      </div>
    </>
  )
}
