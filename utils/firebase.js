import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
	apiKey: "AIzaSyCiTxiWzxAOndzpeNyy3TuLeT9bxnM0ra4",
	authDomain: "eventtiz.firebaseapp.com",
	projectId: "eventtiz",
	storageBucket: "eventtiz.appspot.com",
	messagingSenderId: "600043838110",
	appId: "1:600043838110:web:8e094eec1f41d6c353f98f",
	measurementId: "G-25R0S4XSE6",
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { provider, auth, storage };
export default db;
