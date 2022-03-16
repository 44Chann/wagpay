// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../supabase'
import verifyUser from '../middlewares/verifyUser'
import { Product } from '../product'
import createProducts from '../utils/createProducts'
import connect_product_to_pages from '../utils/connect_product_to_pages'

async function create(req: NextApiRequest, res: NextApiResponse<any>) {
	
	if(req.method === 'POST') {
		const submissionData = JSON.parse(req.body)
		console.log(submissionData)
		const { data: sub_data, error } = await supabase.from('submission')
		.update({
			transaction_hash: submissionData.transaction_hash,
		})
		.match({
			id: submissionData.id
		})

		if(!sub_data || error || sub_data?.length === 0) {
			res.status(400).send('Page was not created ' + JSON.stringify(error))
			return
		}

		res.status(201).send(submissionData)
	}
}

export default create