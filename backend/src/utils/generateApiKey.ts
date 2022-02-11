import getUuid from "uuid-by-string";
import crypto from 'crypto'

export const generateAPIKey = (user_id: number, store_id: number, store_name: string) => {
	const random = crypto.randomBytes(20).toString('hex')

	const api_key = getUuid(`${user_id} ${store_id} ${store_name} ${random}`)

	return api_key
}