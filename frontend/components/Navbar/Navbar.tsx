import Link from "next/link";
import { useState } from "react";

import ConnectWallet from '../Wallet'

const Navbar = () => {

	return (
		<nav className="z-50 fixed px-16 left-0 right-0 top-0  w-full m-auto backdrop-blur-2xl flex justify-between py-4 items-center font-inter">
			<h1 className="font-bold text-xl px-3">WagPay</h1>

			<ul className="flex justify-center item-center">
				{[
					{
						name: "Home",
						link: "/",
					},
					{
						name: "Developers",
						link: "/dashboard",
					},
					{
						name: "Login",
						link: "/auth",
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
				<Link href="/claim">
					<a className="rounded-xl ml-4 bg-[#6C7EE1] px-8 text-white py-3 hover:scale-110 duration-200">Claim Username</a>
				</Link>
			</ul>
		</nav>

	);
};

export default Navbar;