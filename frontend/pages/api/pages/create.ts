// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

interface Page {
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
}

async function create(req: NextApiRequest, res: NextApiResponse<Page | string>) {
	let jwt = await verifyUser(req, res)
	let { user, error } = await supabase.auth.api.getUser(req.headers['bearer-token'] as string)
	
	if(req.method === 'POST') {
		const pageData = JSON.parse(req.body) as Page
		let { products, ...page } = pageData
		
		console.log(page, products)
		const { data, error } = await supabase
			.from('pages')
			.insert([page])
		
		if(error || data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}
		
		let product_ids = await createProducts(products)
		let connect_product = await connect_product_to_pages(product_ids, data[0].id)

		res.status(201).send(page as Page)
	}
}

export default create