import Link from "next/link";
import { useState } from "react";

import ConnectWallet from './Wallet'

const Navbar = () => {
	const [walletModal, setWalletModal] = useState(false)

	return (
		<nav className="flex font-poppins justify-between w-full bg-brand-dark text-white px-16 py-6 items-center">
		<Link href="/">
			<a className="text-2xl font-bold">throwitin</a>
		</Link>
		<div className="">
			<ul className="flex space-x-5 ml-48">
			{[
				{
					name: "Start Project",
					link: "/startProject",
				},
				{
					name: "Fund Project",
					link: "/",
				},
				{
					name: "Leaderboard",
					link: "/",
				},
				{
					name: "About",
					link: "/about",
				},
			].map((item) => (
				<Link href={item.link}>
					<a className="text-sm px-2 py-1 cursor-pointer">{item.name}</a>
				</Link>
			))}
			</ul>
		</div>
		<div className="flex space-x-4">
			<button className="bg-gray-100 py-2 px-4 rounded text-black flex text-sm items-center">
				<span className="mr-2">
					<svg
						width="19"
						height="18"
						viewBox="0 0 19 18"
						fill="none"
						xmlns="http://www.w3.org/2000/svg">
						<path
						d="M1.5 10H7.5C7.76522 10 8.01957 9.89464 8.20711 9.70711C8.39464 9.51957 8.5 9.26522 8.5 9V1C8.5 0.734784 8.39464 0.48043 8.20711 0.292893C8.01957 0.105357 7.76522 0 7.5 0H1.5C1.23478 0 0.98043 0.105357 0.792893 0.292893C0.605357 0.48043 0.5 0.734784 0.5 1V9C0.5 9.26522 0.605357 9.51957 0.792893 9.70711C0.98043 9.89464 1.23478 10 1.5 10ZM0.5 17C0.5 17.2652 0.605357 17.5196 0.792893 17.7071C0.98043 17.8946 1.23478 18 1.5 18H7.5C7.76522 18 8.01957 17.8946 8.20711 17.7071C8.39464 17.5196 8.5 17.2652 8.5 17V13C8.5 12.7348 8.39464 12.4804 8.20711 12.2929C8.01957 12.1054 7.76522 12 7.5 12H1.5C1.23478 12 0.98043 12.1054 0.792893 12.2929C0.605357 12.4804 0.5 12.7348 0.5 13V17ZM10.5 17C10.5 17.2652 10.6054 17.5196 10.7929 17.7071C10.9804 17.8946 11.2348 18 11.5 18H17.5C17.7652 18 18.0196 17.8946 18.2071 17.7071C18.3946 17.5196 18.5 17.2652 18.5 17V10C18.5 9.73478 18.3946 9.48043 18.2071 9.29289C18.0196 9.10536 17.7652 9 17.5 9H11.5C11.2348 9 10.9804 9.10536 10.7929 9.29289C10.6054 9.48043 10.5 9.73478 10.5 10V17ZM11.5 7H17.5C17.7652 7 18.0196 6.89464 18.2071 6.70711C18.3946 6.51957 18.5 6.26522 18.5 6V1C18.5 0.734784 18.3946 0.48043 18.2071 0.292893C18.0196 0.105357 17.7652 0 17.5 0H11.5C11.2348 0 10.9804 0.105357 10.7929 0.292893C10.6054 0.48043 10.5 0.734784 10.5 1V6C10.5 6.26522 10.6054 6.51957 10.7929 6.70711C10.9804 6.89464 11.2348 7 11.5 7Z"
						fill="#000814"
						/>
					</svg>
				</span>
				Dashboard
			</button>
			<div className="text-xs">
				<button onClick={() => setWalletModal(true)} className="bg-gray-100 py-2 px-4 rounded text-black flex text-sm items-center">
					{!walletModal ? <span>Connect Wallet</span> : <span></span>}
					<ConnectWallet walletModal={walletModal} setWalletModal={setWalletModal} />
					<div onClick={() => setWalletModal(false)}>
						<svg  xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
							<path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
						</svg>
					</div>
				</button>
			</div>
		</div>
		</nav>
	);
};

export default Navbar;