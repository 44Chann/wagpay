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
} from '@heroicons/react/solid'
import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { Product } from '../../pages/api/product'

const statusStyles = {
	success: 'bg-green-100 text-green-800',
	processing: 'bg-yellow-100 text-yellow-800',
	failed: 'bg-gray-100 text-gray-800',
}

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ')
}

interface Page {
	id: number
	title: string
	logo: string
	description: string
	social_links: Object
	accepted_currencies: string[]
	terms_conditions: string[]
	slug: string
	eth_address?: string
	sol_address?: string
	user: number
	products: Product[]
	created_data: string
}

export const Ethereum = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" className='w-5 h-5' version="1.1" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 784.37 1277.39">
			<g id="Layer_x0020_1">
				<metadata id="CorelCorpID_0Corel-Layer"/>
				<g id="_1421394342400">
					<g>
						<polygon fill="#343434" fill-rule="nonzero" points="392.07,0 383.5,29.11 383.5,873.74 392.07,882.29 784.13,650.54 "/>
						<polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,0 -0,650.54 392.07,882.29 392.07,472.33 "/>
						<polygon fill="#3C3C3B" fill-rule="nonzero" points="392.07,956.52 387.24,962.41 387.24,1263.28 392.07,1277.38 784.37,724.89 "/>
						<polygon fill="#8C8C8C" fill-rule="nonzero" points="392.07,1277.38 392.07,956.52 -0,724.89 "/>
						<polygon fill="#141414" fill-rule="nonzero" points="392.07,882.29 784.13,650.54 392.07,472.33 "/>
						<polygon fill="#393939" fill-rule="nonzero" points="0,650.54 392.07,882.29 392.07,472.33 "/>
					</g>
				</g>
			</g>
		</svg>
	)
}

export const Solana = () => {
	return (
		<img src='https://cryptologos.cc/logos/solana-sol-logo.png?v=022' className='w-5 h-5'/>
	)
}

interface Props {
	cards: any[]
}

const Overview = ({ cards }: Props) => {
	const [transactions, setTransactions] = useState<any[]>([])
	
	const fetchTransactions = async () => {
		const res = await fetch('/api/submissions/limit', {
			headers: {
				'bearer-token': supabase.auth.session()?.access_token as string
			}
		})
		const data = await res.json()
		
		for(let j=0;j<data.length;j++) {
			const value = data[j]
			const products = value.products
			if(!data[j].total_prices) data[j].total_prices = 0
			var total_price = 0;
			for(let i=0;i<products.length;i++) {
				const ress = await fetch(`http://localhost:3000/api/products/${products[i]}`)
				const res = await ress.json()

				data[j].products[i] = res
				total_price += res.discounted_price
			}
			data[j].total_prices = total_price
		}
		setTransactions(data)
	}

	useEffect(() => {
		console.log('122')
		fetchTransactions()
	}, [])

	const [pages, setPages] = useState<Page[]>([])

	const fetchPages = async () => {
		const data = await fetch('/api/pages/get', {
			headers: {
				'bearer-token': supabase.auth.session()?.access_token as string
			}
		})
		const res = await data.json()
		setPages(res)
	}

	useEffect(() => {
		fetchPages()
	}, [])
	
	return (
		<div className="mt-8">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<h2 className="text-lg font-medium leading-6 text-gray-900">
				Overview
			</h2>
			<div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{/* Card */}
				{cards.map((card) => (
					<div
						key={card.name}
						className="overflow-hidden rounded-lg bg-white shadow"
					>
						<div className="p-5">
						<div className="flex items-center">
							<div className="flex-shrink-0">
							<card.icon
								className="h-6 w-6 text-gray-400"
								aria-hidden="true"
							/>
							</div>
							<div className="ml-5 w-0 flex-1">
							<dl>
								<dt className="truncate text-sm font-medium text-gray-500">
								{card.name}
								</dt>
								<dd>
								<div className="text-lg font-medium text-gray-900">
									{card.amount}
								</div>
								</dd>
							</dl>
							</div>
						</div>
						</div>
						<div className="bg-gray-50 px-5 py-3">
						<div className="text-sm">
							<a
							href={card.href}
							className="font-medium text-cyan-700 hover:text-cyan-900"
							>
							View all
							</a>
						</div>
						</div>
					</div>
				))}
			</div>
			</div>

			<h2 className="mx-auto mt-8 max-w-6xl px-4 text-lg font-medium leading-6 text-gray-900 sm:px-6 lg:px-8">
			Recent activity
			</h2>

			{/* Activity list (smallest breakpoint only) */}
			<div className="shadow sm:hidden">
			<ul
				role="list"
				className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden"
			>
				{transactions && transactions.length > 0 && transactions.map((transaction) => (
				<li key={transaction.id}>
					<a
					href={transaction.href}
					className="block bg-white px-4 py-4 hover:bg-gray-50"
					>
					<span className="flex items-center space-x-4">
						<span className="flex flex-1 space-x-2 truncate">
						<CashIcon
							className="h-5 w-5 flex-shrink-0 text-gray-400"
							aria-hidden="true"
						/>
						<span className="flex flex-col truncate text-sm text-gray-500">
							<span className="truncate">
							{transaction.productName}
							</span>
							<span>
							<span className="font-medium text-gray-900">
								{transaction.amount}
							</span>{' '}
							{transaction.currency}
							</span>
							<time dateTime={transaction.datetime}>
							{transaction.date}
							</time>
						</span>
						</span>
						<ChevronRightIcon
						className="h-5 w-5 flex-shrink-0 text-gray-400"
						aria-hidden="true"
						/>
					</span>
					</a>
				</li>
				))}
			</ul>

			<nav
				className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
				aria-label="Pagination"
			>
				<div className="flex flex-1 justify-between">
				<a
					href="#"
					className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
				>
					Previous
				</a>
				<a
					href="#"
					className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
				>
					Next
				</a>
				</div>
			</nav>
			</div>

			{/* Activity table (small breakpoint and up) */}
			<div className="hidden sm:block">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="mt-2 flex flex-col">
				<div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
					<table className="min-w-full divide-y divide-gray-200">
					<thead>
					<tr>
						<th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Invoice
						</th>
						<th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Transaction
						</th>
						<th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
							Page Name
						</th>
						<th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
							Amount
						</th>
						<th className="hidden bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 md:block">
							Status
						</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
					{transactions && transactions.length > 0 && transactions.map((transaction: any) => (
						<tr key={transaction.id} className="bg-white">
							<td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
							{transaction.id}
							</td>
							<td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
							<div className="flex">
								<a
									// href={transaction.href}
									className="group inline-flex space-x-2 truncate text-sm"
								>
									<p className="truncate text-gray-500 group-hover:text-gray-900">
										{transaction.name} ({transaction.email})
									</p>
								</a>
							</div>
							</td>
							<td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500">
								<Link href={`${transaction.page_id.slug}`}>
									{transaction.page_id.title}
								</Link>
							</td>
							<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
								<span className="font-medium text-gray-900">
									${transaction.total_prices}{' '}
								</span>
								USD
							</td>
							<td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
							<span
								className={classNames(
								// @ts-ignore
								// statusStyles[transaction.status],
								'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize'
								)}
							>
								{transaction.eth_address && 
									<>
										{transaction.transaction_hash === '' ? <span>❌</span> : <span>✅</span>}	
										<a href={`https://etherscan.io/tx/${transaction.transaction_hash}`} className='flex space-x-3'>
											<span>See Transaction on</span> <img src="https://etherscan.io/images/brandassets/etherscan-logo.png" className='w-14' alt="" />
										</a>
									</>
								}
								{transaction.sol_address && 
									<>
										{transaction.transaction_hash === '' ? <span>❌</span> : <span>✅</span>}	
										<a href={`https://solscan.io/tx/${transaction.transaction_hash}`} className='flex space-x-3'>
											<span>See Transaction on</span> <img src="https://solscan.io/static/media/solana-solana-scan-blue.5ffb9996.svg" className='w-14' alt="" />
										</a>
									</>
								}
							</span>
							</td>
						</tr>
						))}
					</tbody>
					</table>
					{/* Pagination */}
					{/* <nav
					className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
					aria-label="Pagination"
					>
					<div className="hidden sm:block">
						<p className="text-sm text-gray-700">
						Showing <span className="font-medium">1</span> to{' '}
						<span className="font-medium">10</span> of{' '}
						<span className="font-medium">20</span> results
						</p>
					</div>
					<div className="flex flex-1 justify-between sm:justify-end">
						<a
						href="#"
						className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
						Previous
						</a>
						<a
						href="#"
						className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
						Next
						</a>
					</div>
					</nav> */}
				</div>
				</div>
			</div>
			</div>
			<div className="hidden sm:block">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="mt-2 flex flex-col">
				<div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
					<table className="min-w-full divide-y divide-gray-200">
					<thead>
						<tr>
							<th className="bg-gray-50 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Store Name
							</th>
							<th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
								Description
							</th>
							<th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
								Accepted Currencies
							</th>
							<th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
								ETH Address
							</th>
							<th className="bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
								SOL Address
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{pages && pages.length > 0 && pages.map((page) => (
							<tr key={page.id} className="bg-white">
								<td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
									<div className="flex">
										<Link
											href={`/${page.slug}`}
										>
											<a className='group inline-flex space-x-2 truncate text-sm'>
												<p className="truncate text-gray-500 group-hover:text-gray-900">
													{page.title}
												</p>
											</a>
										</Link>
									</div>
								</td>
								<td className='w-96 truncate whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500'>
									<span className='w-96 truncate inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize'>
										{page.description}
									</span>
								</td>
								<td className="whitespace-nowrap px-8 flex space-x-3 pt-3 text-sm text-gray-500">
									{page.accepted_currencies.map(currency => (
										<span className="font-medium text-gray-900">
											{currency === 'ETH' && <Ethereum />}
											{currency === 'SOL' && <Solana />}
										</span>
									))}
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									<span
										className='w-20 truncate inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize'
									>
										{page.eth_address}
									</span>...
								</td>
								<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
									<span
										className='w-20 truncate inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize'
									>
										{page.sol_address}
									</span>...
								</td>
							</tr>
						))}
					</tbody>
					</table>
					{/* Pagination */}
					{/* <nav
					className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
					aria-label="Pagination"
					>
					<div className="hidden sm:block">
						<p className="text-sm text-gray-700">
						Showing <span className="font-medium">1</span> to{' '}
						<span className="font-medium">10</span> of{' '}
						<span className="font-medium">20</span> results
						</p>
					</div>
					<div className="flex flex-1 justify-between sm:justify-end">
						<a
						href="#"
						className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
						Previous
						</a>
						<a
						href="#"
						className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
						Next
						</a>
					</div>
					</nav> */}
				</div>
				</div>
			</div>
			</div>
		</div>
	)
}

export default Overview