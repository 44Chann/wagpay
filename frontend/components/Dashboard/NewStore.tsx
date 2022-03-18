import { useEffect, useState } from "react"
import { PlusIcon, XIcon } from '@heroicons/react/solid'
import { supabase } from "../../supabase";

type supported_currencies = 'Ethereum' | 'Solana'

interface Props {
	isOpen: boolean
}

interface Product {
	discounted_price: number
	price: number
	name: string
	description: string
	links: string[]
}

interface Field {
	name: string
	type: string
	value: string
}

const empty_product: Product = {
	discounted_price: 0,
	price: 0,
	name: '',
	description: '',
	links: []
}

const empty_field: Field = {
	name: '',
	type: '',
	value: ''
}

type _fields = 'name' | 'type'
type _products = 'discounted_price' | 'price' | 'name' | 'description' | 'links'

const supported_currencies = ['SOL', 'ETH']

const NewStore = (props: Props) => {
	const [products, setProducts] = useState<Product[]>([])
	const [fields, setFields] = useState<Field[]>([])

	const [title, setTitle] = useState('')
	const [logo, setLogo] = useState('')
	const [description, setDescription] = useState('')
	const [socialLinks, setSocialLinks] = useState<object>({})
	const [currencies, setCurrencies] = useState<string[]>([])
	const [slug, setSlug] = useState<string>('')
	const [eth, setETH] = useState<string>('')
	const [sol, setSOL] = useState<string>('')
	
	const changeField = async (field: _fields, value: string, idx: number) => {
		setFields((previousState) => {
			let field_values = [...fields]
			field_values[idx][field] = value
			return field_values
		})
	}
	
	const changeProduct = async (field: _products, value: any, idx: number) => {
		console.log(field, value, idx)
		if(field === 'discounted_price') {
			setProducts((prevState) => {
				let product_values = [...products]
				product_values[idx].discounted_price = value as number
				return product_values
			})
		} else if (field === 'price') {
			setProducts((prevState) => {
				let product_values = [...products]
				product_values[idx].price = value as number
				return product_values
			})
		} else if (field === 'description') {
			setProducts((prevState) => {
				let product_values = [...products]
				product_values[idx].description = value as string
				return product_values
			})
		} else if (field === 'name') {
			console.log('1')
			setProducts((prevState) => {
				let product_values = [...products]
				product_values[idx].name = value as string
				return product_values
			})
		} else if (field === 'links') {
			setProducts((prevState) => {
				let product_values = [...products]
				product_values[idx].links = String(value).split(',')
				return product_values
			})
		}
	}
	
	const submit = async () => {
		const data = await fetch('/api/pages/create', {
			method: 'POST',
			body: JSON.stringify({
				title: title,
				logo: logo,
				description: description,
				social_links: socialLinks,
				accepted_currencies: currencies,
				slug: slug,
				eth_address: eth,
				sol_address: sol,
				products: products,
				fields: fields
			}),
			headers: {
				'bearer-token': supabase.auth.session()?.access_token as string
			}
		})

		const res = await data.json()
	}

	return (
		<div className={(props.isOpen ? "" : "hidden ") + "z-50 absolute top-0 right-0 w-1/3 h-screen overflow-y-scroll bg-cyan-500 px-16 pt-10 text-white space-y-5"}>
			<h1 className="text-3xl font-black">Create a New Store</h1>
			<div className="flex flex-col space-y-2">
				<label htmlFor="Store">Store Name</label>
				<input type="text" name='Store' value={title} onChange={(e) => setTitle(e.target.value)} className="text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
			</div>
			<div className="flex flex-col space-y-2">
				<label htmlFor="Store">Store Description (What you sell? Who you are?)</label>
				<textarea name='Store' value={description} onChange={(e) => setDescription(e.target.value)} className="text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"></textarea>
			</div>
			<div className="flex flex-col space-y-2">
				<label htmlFor="Store">Store Slug (/store-name)</label>
				<input type='text' name='Store' value={slug} onChange={(e) => setSlug(e.target.value)} className="text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
			</div>
			<div className="flex flex-col space-y-2">
				<label htmlFor="Store">Ethereum Address (If its blank, user's ethereum address will be user)</label>
				<input type='text' name='Store' value={eth} onChange={(e) => setETH(e.target.value)} className="text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
			</div>
			<div className="flex flex-col space-y-2">
				<label htmlFor="Store">Solana Address (If its blank, user's ethereum address will be user)</label>
				<input type='text' name='Store' value={sol} onChange={(e) => setSOL(e.target.value)} className="text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
			</div>
			<div className="flex flex-col space-y-2">
				<label htmlFor="Store">Supported Currenices</label>
				<p>{currencies.map(v => ( <span>{v}</span> ))}</p>
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
						onChange={(e) => setCurrencies(() => [...currencies, e.target.value])}
					>
					{supported_currencies.map(value => {
						return <option value={value}>{value}</option>
					})}
				</select>
			</div>
			<div className="flex flex-col space-y-2">
				<label htmlFor="Store">Form Fields</label>
				{fields.map((field, idx) => {
					return <div key={idx} className="flex flex-col space-y-2">
						<h3>Field {field.name}</h3>
						<div className="flex space-x-2">
							<input value={field.name} onChange={(e) => changeField('name', e.target.value, idx)} type="text" name='Store' placeholder="Field Name" className="w-1/2 text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
							<input value={field.type} onChange={(e) => changeField('type', e.target.value, idx)} type="text" name='Store' placeholder="Field Type" className="w-1/2 text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
						</div>
					</div>
				})}
				<button
					onClick={() => setFields(() => [...fields, empty_field])}
					type="button"
					className="flex justify-center space-x-2 items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
				>
					<span>New Field</span>
					<span className='w-5 h-5'><PlusIcon /></span>
				</button>
			</div>
			<div className="flex flex-col space-y-2">
				<label htmlFor="Store">Products</label>
				{products.map((product, idx) => {
					return <div key={idx} className="flex flex-col space-y-2">
						<h3>Product {product.name}</h3>
						<div className="flex space-x-2">
							<input value={product.name} onChange={(e) => changeProduct('name', e.target.value, idx)} type="text" name='Store' placeholder="Name" className="w-1/2 text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
							<input value={product.discounted_price} onChange={(e) => changeProduct('discounted_price', e.target.value, idx)} type="text" name='Store' placeholder="Price" className="w-1/2 text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
						</div>
						<input value={product.links.join()} onChange={(e) => changeProduct('links', e.target.value, idx)} type="text" name='Store' placeholder="Links" className="w-full text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2" />
						<textarea value={product.description} onChange={(e) => changeProduct('description', e.target.value, idx)} name='Store' placeholder="description" className="text-black rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"></textarea>
					</div>
				})}
				<button
					onClick={() => setProducts(() => [...products, empty_product])}
					type="button"
					className="flex justify-center space-x-2 items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
				>
					<span>New Product</span>
					<span className='w-5 h-5'><PlusIcon /></span>
				</button>
			</div>
			<button
				onClick={() => submit()}
				type="button"
				className="flex justify-center space-x-2 items-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
			>
				Submit
			</button>
		</div>
	)
}

export default NewStore