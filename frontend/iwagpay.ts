import { ethers } from 'ethers'

export interface IWagPay {
	// functions
	sendTransaction(to: string, value: string): Promise<any>
	signTransaction(to: string, value: string): Promise<any>
}