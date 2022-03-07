import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useConnect, useAccount } from 'wagmi'
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { useSignMessage } from 'wagmi'

const Claim = () => {
	toast.configure()
	const [{ data: connectData, error: connectError }, connect] = useConnect()
	const [{ data: accountData }, disconnect] = useAccount({
	  fetchEns: true,
	})
	const [{ data, error, loading }, signMessage] = useSignMessage({
		message: 'gm! \n\n Join WagPay Waitlist!',
	})
	const { publicKey } = useWallet()

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
		if(accountData && accountData.address) setETH(accountData.address)
	}, [accountData?.address])

	useEffect(() => {
		if(publicKey) setSOL(publicKey.toString())
	}, [publicKey])

	const submit = () => {
		let data = {
			username: username,
			eth_address: eth,
			sol_address: sol,
			email: email
		}

		console.log(data)

		let url = `/api/user/create`
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(data)
		})
		.then(res => res.json())
		.then(data => {
			toast.success('Successfully Joined the Waitlist')
		})
		.catch(e => {
			toast.error('Email / Username is already registered')
		})
	}
	
	const checkUsername = async () => {
		let url = `/api/user/check_username?username=${username}`
		
		fetch(url)
		.then(res => res.json())
		.then(data => {
			if(data['is_available']) {
				toast.success('Its Available')
			} else {
				toast.error('Not Available')
			}
		})

	}
	
	return (
		<div className='w-full min-h-screen font-inter flex flex-col justify-center items-start px-16 bg-[#6C7EE1]/20 space-y-10'>
			{/* <ToastContainer /> */}
			<h1 className='text-3xl'>Claim your username</h1>
			<div className='flex flex-col justify-center items-start space-y-10'>
				<div className="bg-white flex justify-between w-full p-2 rounded-xl">
					<input type="email" placeholder="satyam@gmail.com" className="rounded w-full pl-4 py-4 opacity-80 border-0 outline-none text-sm" value={email} onChange={(e: any) => setEmail(e.target.value)} />
				</div>
				<div className="bg-white flex justify-between w-full p-2 rounded-xl">
					<input type="text" placeholder="@satyam" className="rounded w-2/3 pl-4 py-4 opacity-80 border-0 outline-none text-sm" value={username} onChange={(e: any) => setUsername(e.target.value)} />
					<button className="w-1/3 bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] text-white rounded-xl py-3 text-sm" onClick={() => checkUsername()}>Check</button>
				</div>
				{eth === '' ? 
					<button className='wallet-adapter-button wallet-adapter-button-trigger' onClick={() => setIsOpen(true)}>Connect ETH Wallet</button>
					:
					<p>{eth}</p>
				}
				<div className={(isOpen ? '' : 'hidden') + " text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl w-1/3 h-1/2 flex flex-col justify-center items-center space-y-5 transition-opacity duration-1000 ease-out"}>
					<button className="absolute top-5 right-5 text-black" onClick={() => setIsOpen(false)}>X</button>
					<h2 className="text-black font-bold text-2xl">Connect Your Wallet</h2>
					<div>
						{connectData.connectors.map((connector) => (
							<button
								key={connector.id}
								onClick={async () => {await connect(connector); setETH(accountData?.address as string)}}
								className="p-3 bg-black m-3 flex justify-center items-center space-x-3 w-64 rounded-xl"
							>
							{connector.name.toLowerCase() === 'metamask' && <img className="w-10" src="/MetaMask_Fox.svg" />}
							{connector.name.toLowerCase() === 'walletconnect' && <img className="w-10" src="/walletconnect-circle-blue.svg" />}
							{connector.name.toLowerCase() === 'coinbase wallet' && <img className="w-10" src="/coinbase.png" />}
							<span>{connector.name}</span>
							{!connector.ready && ' (unsupported)'}
							</button>
						))}
					</div>
				</div>
				{sol === '' ? <WalletMultiButton /> : <p>{sol}</p>}
				<button onClick={() => submit()} className="w-1/3 bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] text-white rounded-xl py-3 text-sm">Claim</button>
			</div>
		</div>
	)
}

export default Claim