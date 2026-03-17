// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwsxkIpYCfziwLVFAUE6SMgOWMNImq5ss",
  authDomain: "fortis-mail.firebaseapp.com",
  projectId: "fortis-mail",
  storageBucket: "fortis-mail.firebasestorage.app",
  messagingSenderId: "979194289632",
  appId: "1:979194289632:web:5ab9f8e2cac8635b609f85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Optional: Enable offline persistence for Firestore if needed later
// enableIndexedDbPersistence(db).catch((err) => {
//   if (err.code == 'failed-precondition') {
//       console.log("Multiple tabs open, persistence can only be enabled in one tab at a a time.")
//   } else if (err.code == 'unimplemented') {
//       console.log("The current browser does not support all of the features required to enable persistence")
//   }
// });
