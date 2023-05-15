import {
	signInWithEmailAndPassword,
	signOut,
	createUserWithEmailAndPassword,
} from "firebase/auth";
import { toast } from "react-toastify";
import {
	getDownloadURL,
	ref,
	uploadString,
	deleteObject,
} from "@firebase/storage";
import db, { storage, auth } from "./firebase";
import emailjs from "@emailjs/browser";

import {
	getDoc,
	addDoc,
	collection,
	doc,
	updateDoc,
	onSnapshot,
	query,
	deleteDoc,
	where,
	arrayUnion,
} from "@firebase/firestore";

const sendEmail = (
	name,
	email,
	title,
	time,
	date,
	note,
	description,
	passcode,
	flier_url,
	setSuccess,
	setLoading
) => {
	emailjs
		.send(
			process.env.NEXT_PUBLIC_SERVICE_ID,
			process.env.NEXT_PUBLIC_TEMPLATE_ID,
			{
				name,
				email,
				title,
				time: convertTo12HourFormat(time),
				date,
				note,
				description,
				passcode,
				flier_url,
			},
			process.env.NEXT_PUBLIC_API_KEY
		)
		.then(
			(result) => {
				setLoading(false);
				setSuccess(true);
			},
			(error) => {
				alert(error.text);
			}
		);
};

export const generateID = () => Math.random().toString(36).substring(2, 10);
export const createSlug = (sentence) => {
	let slug = sentence.toLowerCase().trim();
	slug = slug.replace(/[^a-z0-9]+/g, "-");
	slug = slug.replace(/^-+|-+$/g, "");
	return slug;
};

export const addEventToFirebase = async (
	id,
	title,
	date,
	time,
	venue,
	description,
	note,
	flier,
	router
) => {
	const docRef = await addDoc(collection(db, "events"), {
		user_id: id,
		title,
		date,
		time,
		venue,
		description,
		note,
		slug: createSlug(title),
		attendees: [],
		disableRegistration: false,
	});

	const imageRef = ref(storage, `events/${docRef.id}/image`);

	if (flier !== null) {
		await uploadString(imageRef, flier, "data_url").then(async () => {
			//👇🏻 Gets the image URL
			const downloadURL = await getDownloadURL(imageRef);
			//👇🏻 Updates the docRef, by adding the logo URL to the document
			await updateDoc(doc(db, "events", docRef.id), {
				flier_url: downloadURL,
			});

			//Alerts the user that the process was successful
			successMessage("Event created! 🎉");
			router.push("/dashboard");
		});
	} else {
		successMessage("Event created! 🎉");
		router.push("/dashboard");
	}
};

export const successMessage = (message) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};
export const errorMessage = (message) => {
	toast.error(message, {
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	});
};

export const firebaseCreateUser = (email, password, router) => {
	createUserWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			successMessage("Account created 🎉");
			router.push("/login");
		})
		.catch((error) => {
			console.error(error);
			errorMessage("Account creation declined ❌");
		});
};
export const firebaseLoginUser = (email, password, router) => {
	signInWithEmailAndPassword(auth, email, password)
		.then((userCredential) => {
			const user = userCredential.user;
			successMessage("Authentication successful 🎉");
			router.push("/dashboard");
		})
		.catch((error) => {
			console.error(error);
			errorMessage("Incorrect Email/Password ❌");
		});
};

export const firebaseLogOut = (router) => {
	signOut(auth)
		.then(() => {
			successMessage("Logout successful! 🎉");
			router.push("/");
		})
		.catch((error) => {
			errorMessage("Couldn't sign out ❌");
		});
};

export const getEvents = (id, setEvents, setLoading) => {
	try {
		const q = query(collection(db, "events"), where("user_id", "==", id));

		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const firebaseEvents = [];
			querySnapshot.forEach((doc) => {
				firebaseEvents.push({ data: doc.data(), id: doc.id });
			});
			setEvents(firebaseEvents);
			setLoading(false);

			return () => unsubscribe();
		});
	} catch (error) {
		console.error(error);
	}
};

export const convertTo12HourFormat = (time) => {
	const [hours, minutes] = time.split(":").map(Number);
	const period = hours >= 12 ? "pm" : "am";
	const hours12 = hours % 12 || 12;
	const formattedTime = `${hours12.toString().padStart(2, "0")}:${minutes
		.toString()
		.padStart(2, "0")}`;
	return `${formattedTime}${period}`;
};

export const updateRegLink = async (id) => {
	const number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
	const eventRef = doc(db, "events", id);
	updateDoc(eventRef, {
		disableRegistration: true,
		slug: `expired-${number}`,
	});
};
export const registerAttendee = async (
	name,
	email,
	event_id,
	setSuccess,
	setLoading
) => {
	setLoading(true);
	const passcode = generateID();
	const eventRef = doc(db, "events", event_id);
	const eventSnap = await getDoc(eventRef);
	let firebaseEvent = {};
	if (eventSnap.exists()) {
		firebaseEvent = eventSnap.data();
		const attendees = firebaseEvent.attendees;
		const result = attendees.filter((item) => item.email === email);
		if (result.length === 0 && firebaseEvent.disableRegistration === false) {
			await updateDoc(eventRef, {
				attendees: arrayUnion({
					name,
					email,
					passcode,
				}),
			});
			const flierURL = firebaseEvent.flier_url
				? firebaseEvent.flier_url
				: "No flier for this event";
			sendEmail(
				name,
				email,
				firebaseEvent.title,
				firebaseEvent.time,
				firebaseEvent.date,
				firebaseEvent.note,
				firebaseEvent.description,
				passcode,
				flierURL,
				setSuccess,
				setLoading
			);
		} else {
			setLoading(false);
			errorMessage("User already registered ❌");
		}
	}
};

export const deleteEvent = async (id) => {
	await deleteDoc(doc(db, "events", id));

	const imageRef = ref(storage, `events/${id}/image`);
	deleteObject(imageRef)
		.then(() => {
			console.log("Deleted successfully");
		})
		.catch((error) => {
			console.error("Image does not exist");
		});
};
