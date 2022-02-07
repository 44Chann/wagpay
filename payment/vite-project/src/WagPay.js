import { ethers } from 'ethers'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';

class WagPay {
	window;
	signer;
	ethProvider;
	solProvider;
	merchantEth;
	merchantSol;
	solConnection;

	constructor(window, merchantEth, merchantSol) {
		this.window = window
		this.ethProvider = new ethers.providers.Web3Provider(this.window.ethereum)
		this.signer = this.ethProvider.getSigner()

		
		this.merchantEth = merchantEth;
		this.merchantSol = merchantSol
	}
	
	sendEthTransaction = async (value) => {
		const tx = await this.signer.sendTransaction({
			to: this.merchantEth,
			value: ethers.utils.parseEther(value)
		})

		return tx.hash
	}

	sendSolTransaction = async (value) => {
		await this.window.solana.connect()
		this.solProvider = this.window.solana
		this.solConnection = new Connection(clusterApiUrl('devnet'))
		
		var transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: this.solProvider.publicKey,
				toPubkey: new PublicKey(this.merchantSol),
				lamports: value * LAMPORTS_PER_SOL
			})
		)

		transaction.feePayer = await this.solProvider.publicKey
		let blockhashObj = await this.solConnection.getRecentBlockhash();
		transaction.recentBlockhash = await blockhashObj.blockhash;

		if(transaction) {
			console.log("Txn created successfully");
		}
		
		let signed = await this.solProvider.signTransaction(transaction);
		let signature = await this.solConnection.sendRawTransaction(signed.serialize());
		await this.solConnection.confirmTransaction(signature);

		console.log("Signature: ", signature);
	}
}

export default WagPay