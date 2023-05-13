import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { BsFillShareFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { convertTo12HourFormat } from "../utils/util";
import ShareEventModal from "./ShareEventModal";
import { deleteEvent } from '../utils/util';

const Events = ({ events }) => {
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false)
	const handleRoute = (slug, id) =>
		router.push({ pathname: `/events/${id}/${slug}` });

	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	return (
		<div className='w-full flex flex-col items-center py-[60px] px-[20px]'>
			<Link href='/create/event'>
				<button className='bg-[#FFD95A] border-[1px] px-6 py-4 rounded-lg mb-4'>
					Create an event ticket
				</button>
			</Link>
			<div className='w-full flex flex-wrap items-center justify-center'>
				{events.map((event) => (
					<div
						className='md:w-[450px] w-full hover:shadow border-[1px] rounded-2xl m-3'
						key={event.id}
					>
						<div
							className='p-4 w-full cursor-pointer'
							onClick={() => handleRoute(event.data.slug, event.id)}
						>
							<h2 className='text-xl font-medium mb-6'>{event.data.title}</h2>
							<p className='opacity-80'>
								{event.data.attendees.length > 0
									? `${event.data.attendees.length} people registered`
									: `No attendee yet`}
							</p>
							<p className='opacity-50'>
								Time: {convertTo12HourFormat(event.data.time)}
							</p>
							<p className='opacity-50'>Date: {event.data.date}</p>
							<p className='opacity-50'>Venue: {event.data.venue}</p>
						</div>

						<div className='w-full py-6 bg-[#C07F00] rounded-b-2xl flex items-center px-4 justify-between'>
							<MdDelete className='text-gray-200 text-2xl cursor-pointer' onClick={()=> deleteEvent(event.id)} />
							{!event.data.disableRegistration && (
								<BsFillShareFill
									className='text-white text-xl cursor-pointer'
									onClick={openModal}
								/>
							)}
						</div>
						{showModal && (
							<ShareEventModal event={event} closeModal={closeModal} />
						)}
						
					</div>
				))}
			</div>
		</div>
	);
};

export default Events;
