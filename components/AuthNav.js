import React, { useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { useRouter } from "next/router";
import { firebaseLogOut } from "../utils/util";

const AuthNav = ({ user }) => {
	const [hamburger, setHamburger] = useState(false);
	const router = useRouter();

	const signOut = () => firebaseLogOut(router);

	return (
		<div className='h-[10vh] flex items-center justify-between px-[20px] sticky top-0 border-b-[1px] bg-white z-40'>
			<Link href='/'>
				<h1
					className='text-xl font-bold 
            '
				>
					EventTiz
				</h1>
			</Link>
			<div className='md:flex hidden items-center justify-between'>
				<p className='mr-4 text-gray-400 hover:text-black'>
					{user["email"]?.substring(0, 6)}
				</p>

				<button
					className='mr-4 text-[#9E6F21] text-medium hover:text-black'
					onClick={signOut}
				>
					SIGN OUT
				</button>
			</div>
			<div className='md:hidden block'>
				<GiHamburgerMenu
					className='cursor-pointer text-2xl text-gray-400'
					onClick={() => setHamburger(true)}
				/>
			</div>
			{hamburger && (
				<nav className='fixed top-0 right-0 w-1/2 dim h-[100vh] p-6'>
					<div className='w-full flex items-center justify-end mb-8'>
						<MdCancel
							className='text-4xl text-[#C07F00] cursor-pointer hover:text-white'
							onClick={() => setHamburger(false)}
						/>
					</div>
					<div className='flex w-full flex-col space-y-8'>
						<div className='flex items-center space-x-3 text-white hover:text-[#C07F00]'>
							<FaUserAlt />
							<p>{user["email"]?.substring(0, 6)}</p>
						</div>
						<Link
							href='/'
							className='hover:text-white text-[#C07F00]'
							onClick={signOut}
						>
							Sign Out
						</Link>
					</div>
				</nav>
			)}
		</div>
	);
};

export default AuthNav;
