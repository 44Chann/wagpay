import { ethers } from './et.js'
// import { IWagPay } from './iwagpay'

class ApiKeyDoesNotExists {}

function isValid(apiKey) {
	return true
}

class WagPay {
	provider;
	signer;

	constructor(provider, apiKey) {
		if(!isValid(apiKey)) throw new ApiKeyDoesNotExists()

		this.provider = new ethers.providers.Web3Provider(window.ethereum);
		this.signer = this.provider.getSigner()
	}

	sendTransaction = async (to, value) => {
		const tx = await this.signer.sendTransaction({
			to: to,
			value: ethers.utils.parseEther(value)
		})

		return tx.hash
	}
	
	signTransaction = async (to, value) => {
		const tx = await this.signer.signTransaction({
			from: '0x608daCeDd086d005A39eA1c251D63f5F3c5ad892',
			value: '1000000000000000000', // 1 ether
			to: '0xe60a0b8A16Ce23923B3E0457349bA022f4bB3Be2',
		})
	
		return tx
	}
}

export default WagPay