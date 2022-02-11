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

	constructor(window, merchantEth, merchantSol, currency, wallet) {
		try {
			this.window = window
	
			this.merchantEth = merchantEth;
			this.merchantSol = merchantSol

			this.currency = currency
			this.wallet = wallet
		} catch (e) {
			console.log("WagPay: Can't initialize WagPay, check if you are passing params correctly!")
		}
	}

	connectEth = async () => {
		if(this.wallet.toUpperCase() === 'METAMASK') this.connectMetamask()
		else throw("No Wallet Exists!")
	}
	
	connectMetamask = async () => {
		try {
			const { ethereum } = this.window;
		
			if (ethereum) {
				const accounts = await ethereum.request({
					method: "eth_requestAccounts",
				});
		
				if (accounts.length !== 0) {
					console.log(accounts)
					return accounts[0]
					console.log("Found");
				} else {
					console.log("Not Found");
				}
			} else {
				console.log("Install Metamask");
			}
		} catch (e) {
			console.log(e);
		}
	}
	
	connectSol = async () => {
		try {
			await this.window.solana.connect()
			return this.window.solana.publicKey
		} catch (e) {
			console.log(e)
		}
	} 
	
	sendEthTransaction = async (value) => {
		this.ethProvider = new ethers.providers.Web3Provider(window.ethereum);
		this.signer = await this.ethProvider.getSigner();
		try {
			const tx = await this.signer.sendTransaction({
				to: this.merchantEth,
				value: ethers.utils.parseEther(value)
			})
	
			return tx.hash
		} catch (e) {
			console.log("WagPay: Can't send transaction!")
		}
	}

	sendSolTransaction = async (value) => {
		try {
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
			return signature
		} catch (e) {
			console.log("WagPay: Can't send transaction!")
		}
	}
}

export default WagPay