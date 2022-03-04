import Link from "next/link";
import { useState } from "react";

import ConnectWallet from '../Wallet'

const Navbar = () => {

	return (


		<nav className="sticky  left-0 right-0 top-0  w-[90%] m-auto backdrop-blur-2xl flex justify-between py-4 items-center">
			<h1>Wagpay</h1>

			<ul className="flex justify-center">
				{[
					{
						name: "Home",
						link: "/",
					},
					{
						name: "Developers",
						link: "/developers",
					},
					{
						name: "Products",
						link: "/products",
					},
					{
						name: "Use Cases",
						link: "/useCases",
					},
				].map((item) => (
					<Link href={item.link}>
						<a className="hover:border-b-[1px] border-black text-sm px-3 py-1 cursor-pointer">{item.name}</a>
					</Link>
				))}
			</ul>

			<ul className="flex justify-between items-center">
				<Link href="/Dasboard">
					<div className="flex items-center bg-[#F4F4FE]  px-4 py-3">

						<a href="" className="hover:border-b-[1px] border-black" >DashBoard</a>
						<span className="px-3">{">"}</span>
					</div>

				</Link>
				<Link href="/ETH">

					<a className="ml-4 bg-[#6C7EE1] px-8 text-white py-3">log in</a>
				</Link>
			</ul>
		</nav>

	);
};

export default Navbar;