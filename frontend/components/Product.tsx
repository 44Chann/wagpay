import { useEffect, useState } from "react"
import { Product } from "../pages/api/product"

interface Props {
	product: Product
	add: Function
	remove: Function
	productIds: any[]
}

const Product = (props: Props) => {
	const [isOpen, setIsOpen] = useState(false)
	const [checked, setChecked] = useState(false)

	const handleCheckChange = (e: any) => {
		setChecked(e.target.checked)
		if(e.target.checked) {
			props.add([props.product])
		} else {
			console.log(1)
			props.remove([props.product])
		}
	}

	useEffect(() => {
		if(props.productIds && props.productIds.length > 0) setChecked(props.productIds.includes(props.product.id.toString()))
	}, [])

	return (
		<div className="w-full h-full flex flex-col grow-0 justify-start items-start">
			<div className="flex justify-center items-center space-x-5">
				<div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer flex justify-start items-center space-x-3">
					{!isOpen && 
						<svg onClick={() => setIsOpen(true)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
						</svg>
					}
					{isOpen && 
						<svg onClick={() => setIsOpen(false)} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					}
					<h1 className="text-xl font-bold select-none">{props.product.name}</h1>
				</div>
				<input checked={checked} type="checkbox" onChange={(e) => handleCheckChange(e)} name="" id="" />
			</div>
			<div className={(isOpen ? "" : "hidden ") + "w-full p-3 space-y-3"}>
				<img src="https://png2.cleanpng.com/sh/b5f8f61ac2e665b21d0a1791394a8bbc/L0KzQYm3VMAzN5RvfZH0aYP2gLBuTgN1badqRdVqcnXvfH70ifNpaZZxReVsb4T3PcXvhb1wbpdue9c2ZIfsd7n7TgNkcKN6Rdlqbnf2hLb5TcVia2M4TdZuZXLlcrO6Tsc5PGI6UaQCMUW1QoeAV8IyPGo7Tag3cH7q/kisspng-steve-carell-michael-scott-the-office-dwight-schru-gangster-5ac235deebbbb3.7841592715226772149656.png" alt="" className="w-36 h-36" />
				<p className="text-md font-normal">
					{props.product.description}
					{props.product.price} / {props.product.discounted_price}
				</p>
				<div className="flex flex-col space-y-3">
					{props.product.links.map(value => (
						<a href={value} className="text-xs text-blue-900 underline">{value}</a>
					))}
				</div>
			</div>
		</div>
	)
}

export default Product