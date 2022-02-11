import { NextFunction, Request, Response } from "express";
import { verify } from 'web3-token';
import { supabase } from "../client";
import { definitions } from "../types";

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
	let signed_msg = req.headers['signed_msg']
	let { address, body } = await verify(signed_msg as string)
	console.log(address)

	const { data, error } = await supabase
		.from('User')
		.select('*')
		.eq('eth_address', address)

	if(error || data?.length === 0) {
		res.status(400).send('User not found:(')
		return
	}

	res.locals.user = data
	
	next()
}