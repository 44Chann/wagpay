import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAccount, useConnect, useSignMessage } from "wagmi"
import EthereumQRPlugin from 'ethereum-qr-code'
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { createQR, encodeURL } from '@solana/pay'
import BigNumber from 'bignumber.js';
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";
import { supabase } from "../supabase";

type supported_currencies = 'Ethereum' | 'Solana' | 'USDC (Solana)' | 'USDC (Ethereum)'

const currencies = [
	{
		'Ethereum': {
			wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
		},
		'USDC (Ethereum)': {
			wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
		},
		'Solana': {
			wallets: ['Phantom']
		},
		'USDC (Solana)': {
			wallets: ['Phantom']
		}
	}
]

interface Props {
	setIsModalOpen: Function
	setQrCode: Function
}

const PaymentCard = ({ setIsModalOpen, setQrCode }: Props) => {
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
	const [option, setOption] = useState<supported_currencies>('Ethereum')
	const [wallet, setWallet] = useState('Metamask')

	useEffect(() => {
		if(accountData && accountData.address) setETH(accountData.address)
	}, [accountData])

	useEffect(() => console.log(eth), [eth])
	useEffect(() => console.log(sol), [sol])

	const qrCode = async () => {
		if(option.toLowerCase() === 'ethereum') {
			const qr = new EthereumQRPlugin()
			const qrCode = await qr.toDataUrl({
				to: '0x4e7f624C9f2dbc3bcf97D03E765142Dd46fe1C46',
				value: 2,
			}, {})
			setQrCode(qrCode.dataURL)
		} else if(option.toLowerCase() === 'solana') {
			console.log('2.  a customer checkout \n');
			const recipient = new PublicKey('BkHxK8FTeDn2HUva4nc1EBhHbEq54WwhqjQ1AY58g8GZ');
			const amount = new BigNumber(1);
			const reference = new Keypair().publicKey;
			const label = 'Jungle Cats store';
			const message = 'Jungle Cats store - your order - #001234';
			const memo = 'JC#4098';

			const url = encodeURL({ recipient, amount, reference, label, message, memo });

			const qrCode = createQR(url);
			console.log(qrCode)
			setQrCode(qrCode._qr?.createDataURL())
		} else if(option.toLowerCase() === 'usdc (ethereum)') {
			
		} else if(option.toLowerCase() === 'usdc (solana)') {
			const splToken = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
			console.log('3. 💰 Create a payment request link \n');
			const recipient = new PublicKey('BkHxK8FTeDn2HUva4nc1EBhHbEq54WwhqjQ1AY58g8GZ');
			const amount = new BigNumber(1);
			const reference = new Keypair().publicKey;
			const label = 'Jungle Cats store';
			const message = 'Jungle Cats store - your order - #001234';
			const memo = 'JC#4098'
			const url = encodeURL({ recipient, amount, splToken, reference, label, message, memo });
			const qrCode = createQR(url);
			console.log(qrCode)
			setQrCode(qrCode._qr?.createDataURL())
		}
		setIsModalOpen(true)
	}

	const pay = async () => {
		if(option.toLowerCase() === 'solana' || option.toLowerCase() === 'usdc (solana)') {
			await connectSOL()
			const solProvider = window.solana
			const solConnection = new Connection(clusterApiUrl('devnet'))
			
			var transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: solProvider.publicKey,
					toPubkey: new PublicKey('BkHxK8FTeDn2HUva4nc1EBhHbEq54WwhqjQ1AY58g8GZ'),
					lamports: 1 * LAMPORTS_PER_SOL
				})
			)
	
			transaction.feePayer = await solProvider.publicKey
			let blockhashObj = await solConnection.getRecentBlockhash();
			transaction.recentBlockhash = await blockhashObj.blockhash;
	
			if(transaction) {
				console.log("Txn created successfully");
			}
			
			let signed = await solProvider.signTransaction(transaction);
			let signature = await solConnection.sendRawTransaction(signed.serialize());
			await solConnection.confirmTransaction(signature);
			return signature
		} else if(option.toLowerCase() === 'ethereum' || option.toLowerCase() === 'usdc (ethereum)') {
			console.log(wallet)
			const account = await connectData.connectors.find(connector => connector.name.toLowerCase() === wallet.toLowerCase())?.connect()
			setETH(account?.account as string)
			const ethProvider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
			const signer = ethProvider.getSigner()
			try {
				const tx = await signer.sendTransaction({
					to: '0x4e7f624C9f2dbc3bcf97D03E765142Dd46fe1C46',
					value: ethers.utils.parseEther('0.0001')
				})
		
				return tx.hash
			} catch (e) {
				console.log("WagPay: Can't send transaction!")
			}
		}
	}

	return (
		<div className='w-full lg:w-1/2 h-full font-urban flex flex-col justify-center items-center lg:items-end space-y-10'>
			<div className="font-urban shadow-xl relative w-[300px] xl:w-[449px] h-[545px] rounded-xl mt-10 flex flex-col justify-center items-center overflow-hidden">
				<div className="select-none blur-3xl w-96 h-96 -top-20 -left-36 absolute bg-[#FFA8D5]/50 rounded-full"></div>
				<div className="select-none blur-3xl w-96 h-96 -bottom-20 -right-36 absolute bg-[#6C7EE1]/50 rounded-full"></div>
				<div className='z-50 w-full h-full p-5 flex flex-col justify-center items-center space-y-5'>
					<h1 className='text-2xl font-bold'>WagPay</h1>
					<input type="email" placeholder="satyam@gmail.com" className="font-semibold rounded-xl w-full pl-4 py-4 opacity-80 border-0 outline-none text-sm" value={email} onChange={(e: any) => setEmail(e.target.value)} />
					<div className="bg-white opacity-80 flex justify-between w-full  rounded-xl">
						<input type="text" placeholder="Name" className="font-semibold rounded-xl w-full pl-4 py-4 opacity-80 border-0 outline-none text-sm" value={username} onChange={(e: any) => setUsername(e.target.value)} />
					</div>
					<div className="w-full flex justify-between">
						<select className="form-select appearance-none
							block
							w-1/3
							px-3
							py-1.5
							text-base
							font-normal
							text-gray-700
							bg-white bg-clip-padding bg-no-repeat
							border border-solid border-gray-300
							rounded-xl
							transition
							ease-in-out
							focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
							aria-label="Default select example"
							onChange={(e) => setOption(e.target.value as supported_currencies)}
							>
							{Object.keys(currencies[0]).map(currency => {
								return <option value={currency}>{currency}</option>	
							})}
						</select>
						
						<select className="form-select appearance-none
							block
							w-1/3
							px-3
							py-1.5
							text-base
							font-normal
							text-gray-700
							bg-white bg-clip-padding bg-no-repeat
							border border-solid border-gray-300
							rounded-xl
							transition
							ease-in-out
							focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" 
							aria-label="Default select example"
							onChange={(e) => setWallet(e.target.value as supported_currencies)}
							>
							{currencies[0][option as supported_currencies].wallets.map(value => {
								return <option value={value}>{value}</option>
							})}
						</select>
					</div>
					<div className="w-full flex justify-end items-center">
						<div onClick={() => qrCode()} className="w-10 h-10 rounded-xl cursor-pointer">
							<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="" className="w-full h-full" />
						</div>
					</div>
					<button onClick={pay} className="w-full bg-gradient-to-tr from-[#4B74FF] to-[#9281FF] text-white rounded-xl py-3 text-sm">Pay</button>
				</div>
			</div>
		</div>
	)
}

export default PaymentCard