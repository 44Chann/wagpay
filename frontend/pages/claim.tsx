import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useConnect, useAccount } from 'wagmi'
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {  WalletConnectButton } from '@solana/wallet-adapter-react-ui';
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
		if(accountData && accountData.address) setETH(accountData.address)
	}, [accountData])

	useEffect(() => console.log(eth), [eth])
	useEffect(() => console.log(sol), [sol])

	const submit = async () => {
		await signMessage()

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
		<div className='w-full min-h-screen font-urban flex flex-col lg:flex-row justify-center lg:justify-between items-center lg:px-96 bg-[#f5a94e]/20 font-semibold'>
			<div className='w-full flex flex-col justify-center items-center lg:w-1/2 space-y-5'>
				<h1 className='font-black text-5xl'>Next-Gen Crypto Payment Solution for Businesses</h1>
				<p className='font-semibold text-xl'>Claim your WagPay Username and get a chance to win exlusive membership NFT</p>
			</div>

			<div className='w-full lg:w-1/2 h-full font-urban flex flex-col justify-center items-center lg:items-end space-y-10'>
				<div className="font-urban shadow-xl relative w-[300px] xl:w-[449px] h-[545px] bg-[#6C7EE1]/25 rounded-xl mt-10 flex flex-col justify-center items-center overflow-hidden">
					<div className="select-none blur-3xl w-96 h-96 -bottom-20 -right-36 absolute bg-[#FFA8D5]/50 rounded-full"></div>
					<div className="select-none blur-3xl w-96 h-96 -top-20 -left-36 absolute bg-[#6C7EE1]/50 rounded-full"></div>
					<div className='z-50 w-full h-full p-5 flex flex-col justify-center items-center space-y-5'>
						<h1 className='text-2xl font-bold'>Claim Username</h1>
						<input type="email" placeholder="satyam@gmail.com" className="font-semibold rounded-xl w-full pl-4 py-4 opacity-80 border-0 outline-none text-sm" value={email} onChange={(e: any) => setEmail(e.target.value)} />
						<div className="bg-white opacity-80 flex justify-between w-full  rounded-xl">
							<input type="text" placeholder="@satyam" className="font-semibold rounded-xl w-full pl-4 py-4 opacity-80 border-0 outline-none text-sm" value={username} onChange={(e: any) => setUsername(e.target.value)} />
							<button className="w-1/3 bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] text-white rounded-xl py-2 text-sm" onClick={() => checkUsername()}>Check</button>
						</div>
						{eth === '' ? 
							<button className='w-full flex justify-between pl-24 items-center border border-3 border-black p-3 rounded-xl font-semibold' onClick={() => setIsOpen(true)}>
								<span>Connect Ethereum Wallet</span>
								<img src="/eth.png" alt="" className='items-end' />
							</button>
							:
							<p className='w-20 truncate lg:w-full text-center'>{eth}</p>
						}
						<div className={(isOpen ? '' : 'hidden') + " text-white fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl w-1/3 h-1/2 flex flex-col justify-center items-center space-y-5 transition-opacity duration-1000 ease-out"}>
							<button className="absolute top-5 right-5 text-black" onClick={() => setIsOpen(false)}>X</button>
							<h2 className="text-black font-bold text-2xl">Connect Your Wallet</h2>
							<div>
								{connectData.connectors.map((connector) => (
									<button
										key={connector.id}
										onClick={async () => {await connect(connector); console.log(accountData);setETH(accountData?.address as string)}}
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
						{sol === '' ? 
							<button onClick={async () => connectSOL()} className='w-full flex justify-between pl-24 items-center border border-3 border-black p-3 rounded-xl font-semibold'>
								Connect Sol Wallet
								<img src="/sol.png" alt="" />
							</button>
							:
							<p className='w-20 truncate lg:w-full text-center'>{sol}</p>
						}
						<button onClick={() => submit()} className="w-full bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] text-white rounded-xl py-3 text-sm">Claim</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Claim