import Product from "../components/Product"
import PaymentCard from "../components/PaymentCard"
import { useState } from "react"
import { useEffect } from "react"
import { supabase } from "../supabase"
import { useRouter } from "next/router"

const Store = () => {
	const [projects, setProjects] = useState<any[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { store } = useRouter().query
	const [qrCode, setQrCode] = useState('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png')

	useEffect(() => console.log(qrCode), [qrCode])

	useEffect(() => {
		fetch('/api/pages/get', {
			headers: {
				'bearer-token': supabase.auth.session()?.access_token as string
			}
		}).then(d => d.json()).then(s => setProjects(s))
	}, [store])

	useEffect(() => console.log(projects), [projects])

	return (
		<div className="relative bg-[#6C7EE1]/20 w-full min-h-screen flex justify-start items-center font-urban">
			<div className="w-1/2 h-full flex flex-col justify-center items-start pl-24 space-y-5">
				<h1 className="text-4xl font-black">Store Name</h1>
				<div className="w-full h-full flex flex-col justify-center items-start space-y-4">
					<Product></Product>
					<Product></Product>
					<Product></Product>
				</div>
				<p>
					Lorem Ipsum is simply dummy text of the printing and typesetting 
					industry. Lorem Ipsum has been the industry's standard dummy 
					text ever since the 1500s, when an unknown printer took a galley 
					of type and scrambled it to make a type specimen book. It has 
					survived not only five centuries, but also the leap into electronic 
					typesetting, remaining essentially unchanged. It was popularised in 
					the 1960s with the release of Letraset sheets containing Lorem 
					Ipsum passages, and more recently with desktop publishing software 
					like Aldus PageMaker including versions of Lorem Ipsum.
				</p>
			</div>
			<div className="w-1/2 h-full flex justify-center items-center">
				<PaymentCard setIsModalOpen={setIsModalOpen} setQrCode={setQrCode} />
			</div>
			<div className={(isModalOpen ? "" : "hidden") + " w-full h-full backdrop-blur-sm absolute z-50"} onClick={() => setIsModalOpen(false)}>
				<div className={(isModalOpen ? "" : "hidden") + " absolute fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-64 h-64"}>
					<img src={qrCode} alt="" className="w-full h-full" />
				</div>
			</div>
		</div>
	)
}

export default Store