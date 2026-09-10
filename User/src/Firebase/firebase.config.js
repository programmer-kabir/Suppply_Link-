// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkshCmmUliPjaAIg3y6-6lhyaEbUlkiCg",
  authDomain: "supplylink-investors.firebaseapp.com",
  projectId: "supplylink-investors",
  storageBucket: "supplylink-investors.firebasestorage.app",
  messagingSenderId: "1004672109636",
  appId: "1:1004672109636:web:df00953984380702ae4011",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default app;
export { db };