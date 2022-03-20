import Product from "../components/Product"
import PaymentCard from "../components/PaymentCard"
import { ChangeEvent, useLayoutEffect, useRef, useState } from "react"
import { useEffect } from "react"
import { supabase } from "../supabase"
import { useRouter } from "next/router"
import { Product as ProductInterface } from './api/product'
import QRCodeStyling, {
	DrawType,
	TypeNumber,
	Mode,
	ErrorCorrectionLevel,
	DotType,
	CornerSquareType,
	CornerDotType,
	Options
} from "qr-code-styling";

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
	products: ProductInterface[]
	fields: any[]
}

interface Props {
	store: Page
}

export const getServerSideProps = async (context: any) => {
	try {
		const res = await fetch(`https://wagpay.vercel.app/api/pages/${context.params.store}`)
		const store: Page = await res.json()
		return {
			props: {
				store: store
			}
		}
	} catch (e) {
		return {
			redirect: {
				permanent: false,
				destination: `/claim?username=${context.params.store}`
			}
		}
	}
}

const Store = ({ store }: Props) => {
	const { query } = useRouter()

	const updateVisit = async () => {
		console.log(store.id)
		let data = await fetch(`https://wagpay.vercel.app/api/pages/updateVisits?id=${store.id}`, {
			method: 'PATCH'
		})
	}

	useEffect(() => {
		updateVisit()
	}, [])
	
	useEffect(() => {
		if(query.products) {
			const products = query.products as string[]
			(async () => {
				let ids: ProductInterface[] = []
				const promise = await products.map(async (v) => {
					let data = await fetch(`https://wagpay.vercel.app/api/products/${v}`)
					let product = await data.json() as ProductInterface
					console.log(product)
					ids.push(product)
				})
				await Promise.all(promise)
				addNewProduct(ids)
			})()
		}
	}, [])

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [qrCode, setQrCode] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png')
	const [selectedProducts, setSelectedProducts] = useState<ProductInterface[]>([])
	const [totalPrice, setTotalPrice] = useState(0)
	const [url, setUrl] = useState("https://qr-code-styling.com");

	useEffect(() => console.log(qrCode), [qrCode])

	const addNewProduct = async (productId: ProductInterface[]) => {
		let unique: ProductInterface[] = [
			//@ts-ignore
			...new Map([...selectedProducts, ...productId].map((item) => [item["id"], item])).values(),
		]

		let totalValue = 0
		const promise = await unique.map(value => totalValue += value.discounted_price)
		await Promise.all(promise)
		setTotalPrice(totalValue)
		setSelectedProducts(unique)
	}

	useEffect(() => console.log(selectedProducts), [selectedProducts])

	const removeProduct = async (productId: ProductInterface[]) => {
		let unique: ProductInterface[] = selectedProducts
		for(let i=0;i<unique.length;i++) {
			if(unique[i].id === productId[0].id) {
				unique.splice(i, 1)
				break
			}
		}
		console.log(unique)
		let totalValue = 0
		const promise = await unique.map(value => totalValue += value.discounted_price)
		await Promise.all(promise)
		setTotalPrice(totalValue)
		setSelectedProducts(unique)
	}

	const createTransaction = async (email: string, fields: any, eth: string, sol: string) => {
		const transaction = {
			email: email,
			fields: fields,
			eth_address: eth,
			sol_address: sol,
			page_id: store.id,
			products: selectedProducts.map((value) => value.id)
		}

		const data = await fetch('/api/submissions/create', {
			method: 'POST',
			body: JSON.stringify(transaction)
		})
		const res = await data.json()

		return res.id
	}

	const updateTransaction = async (transactionId:number, successful: boolean, transactionHash: string) => {
		const transaction = {
			id: transactionId,
			transaction_hash: transactionHash
		}
		console.log(transaction)
		const data = await fetch('/api/submissions/update', {
			method: 'POST',
			body: JSON.stringify(transaction)
		})
		const res = await data.json()

		console.log(res)
	}

	const [options, setOptions] = useState<Options>({
		width: 300,
		height: 300,
		type: 'svg' as DrawType,
		data: '',
		image: '/spay.svg',
		margin: 10,
		qrOptions: {
			typeNumber: 0 as TypeNumber,
			mode: 'Byte' as Mode,
			errorCorrectionLevel: 'Q' as ErrorCorrectionLevel
		},
		imageOptions: {
			hideBackgroundDots: true,
			imageSize: 0.3,
			margin: 10,
			crossOrigin: 'anonymous',
		},
		dotsOptions: {
			color: '#222222',
			// gradient: {
			//   type: 'linear', // 'radial'
			//   rotation: 0,
			//   colorStops: [{ offset: 0, color: '#8688B2' }, { offset: 1, color: '#77779C' }]
			// },
			type: 'rounded' as DotType
		},
		backgroundOptions: {
			color: '#fff',
			// gradient: {
			//   type: 'linear', // 'radial'
			//   rotation: 0,
			//   colorStops: [{ offset: 0, color: '#ededff' }, { offset: 1, color: '#e6e7ff' }]
			// },
		},
		cornersSquareOptions: {
			color: '#222222',
			type: 'extra-rounded' as CornerSquareType,
			// gradient: {
			//   type: 'linear', // 'radial'
			//   rotation: 180,
			//   colorStops: [{ offset: 0, color: '#25456e' }, { offset: 1, color: '#4267b2' }]
			// },
		},
		cornersDotOptions: {
			color: '#222222',
			type: 'dot' as CornerDotType,
			// gradient: {
			//   type: 'linear', // 'radial'
			//   rotation: 180,
			//   colorStops: [{ offset: 0, color: '#00266e' }, { offset: 1, color: '#4060b3' }]
			// },
		}
	});
	
	const [qrCodes, setQrCodes] = useState<QRCodeStyling>()
	const ref = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if(typeof window !== 'undefined') {
			const QRCodeStyling = require('qr-code-styling')
			setQrCodes(new QRCodeStyling(options))
		}
	}, [])

	useEffect(() => {
		if(!qrCodes) return
		if (ref.current) {
			qrCodes.append(ref.current);
		}
	}, [qrCodes, ref]);

	useEffect(() => {
		if (!qrCodes) return;
		qrCodes.update(options);
	}, [qrCodes, options]);

	const onDataChange = (url: string) => {
		if(!qrCodes) return
		setOptions(options => ({
			...options,
			data: url
		}));
	};

	useEffect(() => {
		onDataChange(url)
	}, [url])

	return (
		<div className="relative bg-[#6C7EE1]/20 w-full min-h-screen flex justify-start items-center font-urban">
			<div className="w-1/2 h-full flex flex-col justify-center items-start pl-24 space-y-5">
				<h1 className="text-4xl font-black">{store.title}</h1>
				<div className="w-full h-full flex flex-col justify-center items-start space-y-4">
					{store.products.map(value => {
						return <Product add={addNewProduct} remove={removeProduct} productIds={query.products as any[]} product={value} />
					})}
				</div>
				<p>
					{store.description}
				</p>
			</div>
			<div className="w-1/2 h-full flex justify-center items-center">
				<PaymentCard setURL={setUrl} updateTransaction={updateTransaction} createTransaction={createTransaction} storeId={store.id} fields={store.fields} totalPrice={totalPrice} merchantETH={store.eth_address as string} merchantSOL={store.sol_address as string} setIsModalOpen={setIsModalOpen} setQrCode={setQrCode} />
			</div>
			<div className={(isModalOpen ? "" : "hidden") + " w-full h-full backdrop-blur-sm absolute z-50"} onClick={() => setIsModalOpen(false)}>
				<div className={(isModalOpen ? "" : "hidden") + " absolute fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-transparent w-64 h-64"}>
					<div ref={ref}></div>
				</div>
			</div>
		</div>
	)
}

export default Store