import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { AiTwotoneCopy } from "react-icons/ai";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { useRouter } from "next/router";
import CopyToClipboard from "react-copy-to-clipboard";

const ShareEventModal = ({ event, closeModal }) => {
	const [copied, setCopied] = useState(false);
	const handleCopy = () => setCopied(true);
	const router = useRouter();
	const registerUrl = event.data
		? `https://eventtiz.vercel.app/register/${event.id}/${event.data.slug}`
		: `https://eventtiz.vercel.app/register/${router.query.id}/${event.slug}`;

	return (
		<div className='w-full h-[100vh] dim absolute top-0 left-0 flex items-center justify-center p-4  z-40'>
			<div className='md:w-2/3 w-full bg-white h-[300px] flex items-center justify-center flex-col rounded-md shadow-[#FFD95A] shadow-md space-y-4 relative'>
				<h2 className='text-xl font-bold text-[#b59a42]'>Share event </h2>
				<div className='w-max-content flex md:flex-row flex-col items-center space-x-3 p-3'>
					<div className='w-full border-[1px] md:mb-0 mb-4 p-2 rounded-md'>
						<p className='text-gray-400 text-center link'>{registerUrl}</p>
					</div>

					{copied ? (
						<BsFillCheckCircleFill className='text-2xl cursor-pointer text-green-500' />
					) : (
						<CopyToClipboard onCopy={handleCopy} text={registerUrl}>
							<AiTwotoneCopy className='text-2xl cursor-pointer' />
						</CopyToClipboard>
					)}
				</div>

				<MdCancel
					className='text-4xl text-[#C07F00] cursor-pointer hover:text-[#b59a42] top-3 absolute right-4'
					onClick={closeModal}
				/>
			</div>
		</div>
	);
};

export default ShareEventModal;
