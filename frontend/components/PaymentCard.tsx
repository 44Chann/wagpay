import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useAccount, useConnect, useSignMessage } from "wagmi"
import EthereumQRPlugin from 'ethereum-qr-code'
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { createQR, encodeURL, findTransactionSignature, FindTransactionSignatureError, validateTransactionSignature } from '@solana/pay'
import BigNumber from 'bignumber.js';
import { ethers } from "ethers";
import { ExternalProvider } from "@ethersproject/providers";
import * as splToken from '@solana/spl-token/src'
import { useNotifications } from '@mantine/notifications';

type supported_currencies = 'Ethereum' | 'Solana'

const currencies = [
	{
		'Ethereum': {
			wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
		},
		// 'USDC (Ethereum)': {
		// 	wallets: ['Metamask', 'WalletConnect', 'Coinbase Wallet']
		// },
		'Solana': {
			wallets: ['Phantom']
		}
		// 'USDC (Solana)': {
		// 	wallets: ['Phantom']
		// }
	}
]

interface Props {
	setIsModalOpen: Function
	setQrCode: Function
	merchantSOL: string
	merchantETH: string
	totalPrice: number
	fields: any[]
	storeId: number
	createTransaction: Function
	updateTransaction: Function
}

const CrossIcon = () => {
	return <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
}

const PaymentCard = ({ fields, createTransaction, updateTransaction, setIsModalOpen, merchantETH, merchantSOL, setQrCode, totalPrice }: Props) => {
	const notifications = useNotifications()
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
	const [price, setPrice] = useState(0)
	const [fieldValues, setFieldValues] = useState<any[]>(fields)

	useEffect(() => {
		if(accountData && accountData.address) setETH(accountData.address)
	}, [accountData])

	useEffect(() => console.log(eth), [eth])
	useEffect(() => console.log(sol), [sol])

	const qrCode = async () => {
		if(option.toLowerCase() === 'ethereum') {
			const qr = new EthereumQRPlugin()
			const qrCode = await qr.toDataUrl({
				to: merchantETH,
				value: 2,
			}, {})
			setQrCode(qrCode.dataURL)
		} else if(option.toLowerCase() === 'solana') {
			const connection = new Connection(clusterApiUrl('mainnet-beta'))

			console.log('2.  a customer checkout \n');
			console.log(merchantSOL)
			const recipient = new PublicKey(merchantSOL);
			console.log(price.toFixed(2))
			const amount = new BigNumber(price.toFixed(2));
			console.log(amount)
			const reference = new Keypair().publicKey;
			const label = 'Jungle Cats store';
			const message = 'Jungle Cats store - your order - #001234';
			const memo = 'JC#4098';

			const url = encodeURL({ recipient, amount, reference, label, message, memo });

			const qrCode = createQR(url);
			console.log(qrCode)
			setQrCode(qrCode._qr?.createDataURL())
			setIsModalOpen(true)

			console.log('\n5. Find the transaction');
			let signatureInfo;
		
			const { signature } = await new Promise((resolve, reject) => {
				/**
				 * Retry until we find the transaction
				 *
				 * If a transaction with the given reference can't be found, the `findTransactionSignature`
				 * function will throw an error. There are a few reasons why this could be a false negative:
				 *
				 * - Transaction is not yet confirmed
				 * - Customer is yet to approve/complete the transaction
				 *
				 * You can implement a polling strategy to query for the transaction periodically.
				 */
				const interval = setInterval(async () => {
					console.count('Checking for transaction...');
					try {
						signatureInfo = await findTransactionSignature(connection, reference, undefined, 'confirmed');
						console.log('\n 🖌  Signature found: ', signatureInfo.signature);
						clearInterval(interval);
						resolve(signatureInfo);
					} catch (error: any) {
						if (!(error instanceof FindTransactionSignatureError)) {
							console.error(error);
							clearInterval(interval);
							reject(error);
						}
					}
				}, 250);
			});
		
			// Update payment status
			let paymentStatus = 'confirmed';
		
			/**
			 * Validate transaction
			 *
			 * Once the `findTransactionSignature` function returns a signature,
			 * it confirms that a transaction with reference to this order has been recorded on-chain.
			 *
			 * `validateTransactionSignature` allows you to validate that the transaction signature
			 * found matches the transaction that you expected.
			 */
			console.log('\n6. 🔗 Validate transaction \n');
		
			try {
				await validateTransactionSignature(
					connection,
					signature,
					recipient,
					amount,
					undefined,
					reference
				);
		
				// Update payment status
				paymentStatus = 'validated';
				console.log('✅ Payment validated');
				console.log('📦 Ship order to customer');
			} catch (error) {
				console.error('❌ Payment failed', error);
			}

		} else if(option.toLowerCase() === 'usdc (ethereum)') {
			
		} else if(option.toLowerCase() === 'usdc (solana)') {
			const splToken = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
			console.log('3. 💰 Create a payment request link \n');
			const recipient = new PublicKey(merchantSOL);
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
		if(totalPrice <= 0) {
			alert('Select a Product')
			return
		}

		if(option.toLowerCase() === 'solana') {			
			const id = notifications.showNotification({
				id: 'hello-there',
				disallowClose: true,
				onClose: () => console.log('unmounted'),
				onOpen: () => console.log('mounted'),
				autoClose: false,
				title: "Transaction Creating",
				message: 'Your Solana Transaction is creating',
				color: 'red',
				icon: <CrossIcon />,
				className: 'my-notification-class',
				style: { backgroundColor: 'red' },
				loading: true,
			});
			try {
				console.log(id)
				await connectSOL()
				const solProvider = window.solana
				const solConnection = new Connection(clusterApiUrl('mainnet-beta'))
				
				var transaction = new Transaction().add(
					SystemProgram.transfer({
						fromPubkey: solProvider.publicKey,
						toPubkey: new PublicKey(merchantSOL),
						lamports: price * LAMPORTS_PER_SOL
					})
				)
		
				transaction.feePayer = await solProvider.publicKey
				let blockhashObj = await solConnection.getRecentBlockhash();
				transaction.recentBlockhash = await blockhashObj.blockhash;
		
				if(transaction) {
					console.log("Txn created successfully");
				}
				
				let signed = await solProvider.signTransaction(transaction);

				var txId = await createTransaction(email, fields, '', solProvider.publicKey)

				let signature = await solConnection.sendRawTransaction(signed.serialize());
				await solConnection.confirmTransaction(signature);
				setTimeout(() => {
					notifications.updateNotification(id, {
					  id,
					  color: 'teal',
					  title: 'Transaction Successful',
					  message:
						'Notification will close in 2 seconds, you can close this notification now',
					  icon: <CrossIcon />,
					  autoClose: 2000,
					});
				}, 3000);

				updateTransaction(txId, true, signature)

				return signature
			} catch (e) {
				updateTransaction(txId, false, '')
				setTimeout(() => {
					notifications.updateNotification(id, {
					  id,
					  color: 'red',
					  title: 'Transaction UnSuccessful',
					  message:
						'Notification will close in 2 seconds, you can close this notification now',
					  icon: <CrossIcon />,
					  autoClose: 2000,
					});
				}, 3000);
			}
		} else if(option.toLowerCase() === 'ethereum' || option.toLowerCase() === 'usdc (ethereum)') {
			const id = notifications.showNotification({
				id: 'hello-there',
				disallowClose: true,
				onClose: () => console.log('unmounted'),
				onOpen: () => console.log('mounted'),
				autoClose: false,
				title: "Transaction Creating",
				message: 'Your Ethereum Transaction is creating',
				color: 'red',
				icon: <CrossIcon />,
				className: 'my-notification-class',
				style: { backgroundColor: 'red' },
				loading: true,
			});
			const account = await connectData.connectors.find(connector => connector.name.toLowerCase() === wallet.toLowerCase())?.connect()
			setETH(account?.account as string)
			const ethProvider = new ethers.providers.Web3Provider(window.ethereum as ExternalProvider);
			const signer = ethProvider.getSigner()
			try {
				const tx = await signer.sendTransaction({
					to: merchantETH,
					value: ethers.utils.parseEther(price.toString())
				})
				
				var txId = await createTransaction(email, fields, account?.account, '')
				
				setTimeout(() => {
					notifications.updateNotification(id, {
					  id,
					  color: 'green',
					  title: 'Transaction Successful',
					  message:
						'Notification will close in 2 seconds, you can close this notification now',
					  icon: <CrossIcon />,
					  autoClose: 2000,
					});
				}, 3000);
				console.log(tx)
				updateTransaction(txId, true, tx.hash)
				return tx
			} catch (e) {
				let txId = await createTransaction(email, fields, account?.account, '')
				updateTransaction(txId, false, '')
				setTimeout(() => {
					notifications.updateNotification(id, {
					  id,
					  color: 'red',
					  title: 'Transaction UnSuccessful',
					  message:
						'Notification will clo`se in 2 seconds, you can close this notification now',
					  icon: <CrossIcon />,
					  autoClose: 2000,
					});
				}, 3000);
				console.log("WagPay: Can't send transaction!", e)
			}
		}
	}

	useEffect(() => {
		if(option.toLowerCase() == 'ethereum') {
			fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
				.then(data => data.json())
				.then(res => setPrice(totalPrice / Number(res.ethereum.usd)))
		} else if(option.toLowerCase() == 'solana') {
			fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
				.then(data => data.json())
				.then(res => setPrice(totalPrice / Number(res.solana.usd)))
		} else {
			setPrice(totalPrice)
		}
	}, [totalPrice, option])

	const changeField = (idx: number, value: any) => {
		setFieldValues((previousState) => {
			let values = [...fieldValues]
			values[idx].value = value
			return values
		})
	}

	useEffect(() => {
		console.log(fieldValues, 'fieldValues')
	}, [fieldValues])

	return (
		<div className='w-full lg:w-1/2 h-full font-urban flex flex-col justify-center items-center lg:items-end space-y-10'>
			<div className="font-urban shadow-xl relative w-[300px] xl:w-[449px] h-[545px] rounded-xl mt-10 flex flex-col justify-center items-center overflow-hidden">
				<div className="select-none blur-3xl w-96 h-96 -top-20 -left-36 absolute bg-[#FFA8D5]/50 rounded-full"></div>
				<div className="select-none blur-3xl w-96 h-96 -bottom-20 -right-36 absolute bg-[#6C7EE1]/50 rounded-full"></div>
				<div className='z-50 w-full h-full p-5 flex flex-col justify-center items-center space-y-5'>
					<h1 className='text-2xl font-bold'>WagPay</h1>
					<div className="bg-white opacity-80 flex justify-between w-full  rounded-xl">
						<input value={email} onChange={(e) => setEmail(e.target.value)}  type='email' placeholder="Email" className="font-semibold rounded-xl w-full pl-4 py-4 opacity-80 border-0 outline-none text-sm" />
					</div>
					{fields.map((value, idx) => (
						<div className="bg-white opacity-80 flex justify-between w-full  rounded-xl">
							<input value={fieldValues[idx].value} onChange={(e) => changeField(idx, e.target.value)}  type={value.type} placeholder={value.name} className="font-semibold rounded-xl w-full pl-4 py-4 opacity-80 border-0 outline-none text-sm" />
						</div>
					))}
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
					<div className="w-full flex justify-between items-center">
						<div className="flex justify-center items-center space-x-2">
							<p>${totalPrice}</p>
							<p>~{price.toFixed(2)} {option.toLowerCase() === 'ethereum' ? 'ETH' : (option.toLowerCase() === 'solana' ? 'SOL' : 'USDC')}</p>
						</div>
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