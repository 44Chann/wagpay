import { NextFunction, Request, Response } from "express";
import { supabase } from "../client";

export const verifyAPIKey = async (req: Request, res: Response, next: NextFunction) => {
	const store_id = req.params['store']
	const api_key = req.headers['api_key']

	const { data, error } = await supabase
		.from('Store')
		.select('*')
		.eq('id', store_id)

	if(error || data?.length === 0) {
		res.status(400).send('API Key not found:(')
		return
	}

	if(data[0].api_key === api_key || data[0].is_api_key_valid) {
		res.locals.is_api_key_valid = true;
	} else {
		res.status(400).send('WagPay: API Key not valid')
		return
	}

	next()
}