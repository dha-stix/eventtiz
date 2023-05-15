import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { HiMail } from "react-icons/hi";
import { AiTwotoneLock } from "react-icons/ai";
import { useRouter } from "next/router";
import { firebaseLoginUser } from "../utils/util";


const login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleSubmit = (e) => {
		e.preventDefault();
		firebaseLoginUser(email, password, router);
	};
	return (
		<div>
			<Head>
				<title>Login | EventTiz</title>
				<meta
					name='description'
					content='An event ticketing system built with NextJS and Firebase'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='w-full flex items-center justify-between min-h-[100vh]'>
				<div className='md:w-[60%] w-full flex flex-col items-center justify-center min-h-[100vh] px-[30px] py-[30px] relative'>
					<Link href='/'>
						<h2 className='text-2xl font-medium mb-6'>Log into your account</h2>
					</Link>
					<form
						className='w-full flex flex-col justify-center'
						onSubmit={handleSubmit}
					>
						<label htmlFor='email'>Email address</label>
						<div className='w-full relative'>
							<input
								type='email'
								name='email'
								className='border px-10 py-2 mb-3 rounded-md w-full'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<HiMail className=' absolute left-4 top-3 text-gray-300 text-xl' />
						</div>
						<label htmlFor='password'>Password</label>
						<div className='w-full relative'>
							<input
								type='password'
								name='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='border px-10 py-2 mb-4 rounded-md w-full'
								required
							/>
							<AiTwotoneLock className=' absolute left-4 top-3 text-gray-300 text-xl' />
						</div>

						<button
							type='submit'
							className='bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md'
						>
							SIGN IN
						</button>
						<p className='text-center'>
							Don't have an account?{" "}
							<Link href='/register' className='text-[#C07F00]'>
								Register
							</Link>
						</p>
					</form>
					<div className='absolute bottom-5 left-5'>
						<p className='opacity-50 text-sm'>
							<Link href='/'>EventTiz</Link> &copy; Copyright{" "}
							{new Date().getFullYear()}{" "}
						</p>
					</div>
				</div>
				<div className='login md:w-[40%] h-[100vh] relative'>
					<div className='absolute bottom-5 right-5'>
						<a
							href='https://github.com/dha-stix'
							target='_blank'
							className='text-gray-100'
						>
							Built by David Asaolu
						</a>
					</div>
				</div>
			</main>
		</div>
	);
};

export default login;
