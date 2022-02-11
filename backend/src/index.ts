import express, { Request, Response } from 'express'
import { supabase } from './client';

import { verifyUser } from './middlewares/verifyUser';
import { definitions } from './types';
import { create_payer } from './utils/create_payer';
import { create_unique_button_id } from './utils/create_unique_button_id';
import { generateAPIKey } from './utils/generateApiKey';

const app = express()
const PORT = 5000

app.use(express.json())

declare global {
	interface Window {
		ethereum: any
	}
}

app.get('/', async (req: Request, res: Response) => {
	res.status(200).send('gm')
})

// Get a User
app.get('/user', [verifyUser], async (req: Request, res: Response) => {
	res.status(200).send(res.locals.user)
})

// Store a User
app.post('/user', async (req: Request, res: Response) => {
	let user: definitions['User'] = req.body

	const { data, error } = await supabase
		.from('User')
		.insert([user])

	if(error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}

	res.status(201).send(data)
})

// Get a Store
app.get('/store/:id', [verifyUser], async (req: Request, res: Response) => {
	let store_id = req.params['id']

	const { data, error } = await supabase
		.from('Store')
		.select('*')
		.eq('user', res.locals.user[0].id)
		.eq('id', store_id)
	
	if(error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}
	
	res.status(200).send(data)
})

// Get All Users Store
app.get('/store', [verifyUser], async (req: Request, res: Response) => {
	console.log(res.locals.user)
	
	const { data, error } = await supabase
		.from('Store')
		.select('*')
		.eq('user', res.locals.user[0].id)
	
	if(error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}
	
	res.status(200).send(data)
})

// Store a Store
app.post('/store', [verifyUser], async (req: Request, res: Response) => {
	let store: definitions['Store'] = req.body

	store.api_key = await generateAPIKey(store.id, store.user, store.store_name)

	const { data, error } = await supabase
		.from('Store')
		.insert([store])
	
	if(error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}

	res.status(201).send(data)
})

// Invoices

// Get Invoices
app.get('/store/:store/invoices', [verifyUser], async (req: Request, res: Response) => {
	const store_id = req.params['store']
	
	const { data, error } = await supabase
		.from('Invoices')
		.select('*, store!inner(*)')
		.eq('store.user', res.locals.user[0].id)
		.eq('store', store_id)
	
	if(error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}
	
	res.status(201).send(data)
})

// Get a Invoices
app.get('/store/:store/invoices/:invoice', [verifyUser], async (req: Request, res: Response) => {
	const store_id = req.params['store']
	const invoice_id = req.params['invoice']
	
	const { data, error } = await supabase
		.from('Invoices')
		.select('*')
		.eq('store', store_id)
		.eq('id', invoice_id)
		
	if(error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}
	
	res.status(201).send(data)
})

// Create Invoices
app.post('/store/:store/invoices', [verifyUser], async (req: Request, res: Response) => {
	const store_id = req.params['store']
	req.body.store = store_id;
	
	if(typeof(req.body.payer) === 'object') {
		const [payer, error] = await create_payer(req.body.payer)
		if(!payer || error || payer?.length === 0) {
			res.status(401).send('Payer does not exists or Payer data has some issues ' + JSON.stringify(payer))
			return
		}
		req.body.payer = payer[0].id
	}

	let invoice: definitions['Invoices'] = req.body
	const { data, error } = await supabase
		.from('Invoices')
		.insert([invoice])
	
	if(error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}
	
	res.status(201).send(data)
})

// Get All Payers Related to a store
app.get('/store/:store/payers', async (req: Request, res: Response) => {
	const store_id = req.params['store']
	
	const { data, error } = await supabase
		.from('Invoices')
		.select('payer!inner(*)')
		.eq('store', store_id)

	if(error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}
	
	res.status(200).send(data)
})

app.get('/pay/:payment_id', [verifyUser], async (req: Request, res: Response) => {
	const payment_id = req.params['payment_id']

	const { data, error } = await supabase
		.from('Payment Button')
		.select('*, store!inner(*), invoice!inner(*)')
		.eq('store.user', res.locals.user[0].id)
		.eq('unique_id', payment_id)

	if(!data || error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}
	
	if(data[0].invoice.is_settled) {
		res.status(400).send('Invoice is already settled😎')
		return
	}

	res.status(200).send(data[0])
})

// Create a Unique Button
app.post('/store/:store/invoices/:invoice/button', async (req: Request, res: Response) => {
	const store_id = req.params['store']
	const invoice_id = req.params['invoice']
	
	const { data, error } = await supabase
		.from('Invoices')
		.select('*')
		.eq('store', store_id)
		.eq('id', invoice_id)
	
	if(!data || error || data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(error))
		return
	}
	
	if(data[0].is_settled) {
		res.status(400).send('Invoice is already settled😎')
		return
	}
	
	const button_id = await create_unique_button_id(store_id, invoice_id, data[0].created_at)

	const button_data: definitions['Payment Button'] = {
		unique_id: button_id,
		amount: data[0].amount,
		store: Number(store_id),
		invoice: Number(invoice_id)
	}

	let data_btn = await supabase
		.from('Payment Button')
		.insert([button_data])

	if(!data_btn.data || data_btn.error || data_btn.data?.length === 0) {
		res.status(400).send('User was not created ' + JSON.stringify(data_btn.error))
		return
	}

	res.json(data_btn.data[0])
})

app.get('/@:username/:store/:payment_id/', async (req: Request, res: Response) => {
	const username = req.params['username']
	const store = req.params['store']
	const payment_id = req.params['payment_id']

	res.sendFile(__dirname + '/test/index.html')
})

app.listen(PORT, () => {
	console.log(`Server listening @ ${PORT}`)
})