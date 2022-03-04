// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

interface Submission {
	name: string
	contact_number?: string
	email: string
	eth_address?: string
	sol_address?: string
	products: number[]
	page: number
}

async function create(req: NextApiRequest, res: NextApiResponse<Submission | string>) {
	let jwt = await verifyUser(req, res)
	let { user, error } = await supabase.auth.api.getUser(req.headers['bearer-token'] as string)
	
	if(req.method === 'POST') {
		const submissionData = JSON.parse(req.body) as Submission
		let { page, products, ...submission } = submissionData

		if(products.length <= 0) {
			res.status(403).send('Select Products first!')
		}

		const { data: sub_data, error } = await supabase.from('submission').insert([submission])

		if(!sub_data || error || sub_data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}
		
		for(let i=0;i<products.length;i++) {
			const { data, error } = await supabase.from('bought').insert([{ product_id: products[i], submission_id:  sub_data[0].id, page_id: page }])
			
			if(!data || error || data?.length === 0) {
				res.status(400).send('Page was not created ' + JSON.stringify(error))
				return
			}
		}

		res.status(201).send(submission as Submission)
	}
}

export default create