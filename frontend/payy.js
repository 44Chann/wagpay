import { ethers } from 'https://cors-anywhere.herokuapp.com/https://cdn.ethers.io/lib/ethers-5.2.esm.min.js'

!function() {
	var me = document.querySelector('script[data-amount]');
    var amount = me.getAttribute('data-amount');

	const button = document.createElement('button')
	button.innerHTML = 'Pay with WagPay'
	button.onclick = toggle

	document.body.appendChild(button);

	const modal = document.createElement('div')
	modal.innerHTML = `
	<div>
		<input id="currency" type="text" placeholder="Currency">
		<input id="amount" type="text" placeholder="amount">
		<input id="wallet" type="text" placeholder="wallet">
		<button id="btn">Confirm</button>
	</div>
	`
	modal.classList.add('hidden')

	document.body.appendChild(modal)

	function toggle() {
		modal.classList.toggle('hidden')
	}

	const btn = document.getElementById('btn')
	btn.onclick = pay

	function pay() {
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()

		const currency = document.getElementById('currency').value
		const wallet = document.getElementById('wallet').value
	
		console.log(currency, amount, wallet)

		signer.sendTransaction({
			to: '0x444A900d6CC95F8d4568cB6e3096f518B9606294',
			value: ethers.utils.parseEther(amount)
		}).then(tx => console.log(tx))
	}
}()