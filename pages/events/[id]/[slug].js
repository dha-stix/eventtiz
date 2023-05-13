import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { AiTwotoneHome } from "react-icons/ai";
import { BsFillShareFill } from "react-icons/bs";
import Attendees from "../../../components/Attendees";
import { useRouter } from "next/router";
import { doc, getDoc } from "@firebase/firestore";
import db from "../../../utils/firebase";
import ShareEventModal from "../../../components/ShareEventModal";
import ErrorPage from "../../../components/ErrorPage";

export async function getServerSideProps(context) {
	const docRef = doc(db, "events", context.query.id);
	const docSnap = await getDoc(docRef);

	let firebaseEvent = {};
	if (docSnap.exists()) {
		firebaseEvent = docSnap.data();
	} else {
		console.log("No such document!");
	}
	return {
		props: { firebaseEvent },
	};
}

const ListEvent = ({ firebaseEvent }) => {
	const [click, setClick] = useState(firebaseEvent.disableRegistration);
	const [showModal, setShowModal] = useState(false);
	const [disableRegModal, setDisableRegModal] = useState(false);
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);
	const router = useRouter();

	if (!firebaseEvent.title) return <ErrorPage />;

	return (
		<div>
			<Head>
				<title>{`${firebaseEvent.title} | EventTiz`}</title>
				<meta
					name='description'
					content='An event ticketing system built with NextJS and Firebase'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='relative w-full'>
				<div className='h-[45vh] p-3 flex flex-col items-center justify-center bg-[#FFD95A]  registergray w-full'>
					<h2 className='text-4xl font-extrabold mb-4 text-center text-white'>
						{firebaseEvent.title}
					</h2>
					{firebaseEvent.attendees.length > 0 && (
						<p className='text-xl font-extrabold mb-6 text-white'>
							Total Attendees:{" "}
							<span className='text-white'>
								{firebaseEvent.attendees.length}
							</span>
						</p>
					)}
				</div>
				<Attendees
					attendees={firebaseEvent.attendees}
					id={router.query.id}
					click={click}
					setClick={setClick}
					disableRegModal={disableRegModal}
					setDisableRegModal={setDisableRegModal}
				/>

				<Link href='/dashboard' className='absolute top-6 left-4 py-2 px-4'>
					<AiTwotoneHome className='text-4xl text-[#FFD95A]' />
				</Link>
				{!click && (
					<BsFillShareFill
						className=' absolute top-6 right-10 cursor-pointer text-2xl text-[#FFD95A]'
						onClick={openModal}
					/>
				)}
				{showModal && (
					<ShareEventModal event={firebaseEvent} closeModal={closeModal} />
				)}
			</main>
		</div>
	);
};

export default ListEvent;
