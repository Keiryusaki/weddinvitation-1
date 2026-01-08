 import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore";
 import { getStorage } from "firebase/storage";
 
 const firebaseConfig = {
   apiKey: "AIzaSyCom9H1ZzSHsqrb-pL1X8xLBv1FgvW_Z30",
   authDomain: "wedding-etin-aji.firebaseapp.com",
   projectId: "wedding-etin-aji",
   storageBucket: "wedding-etin-aji.firebasestorage.app",
   messagingSenderId: "402926456612",
   appId: "1:402926456612:web:8ac1b1c844e7a7f57cadb1"
 };
 
 const app = initializeApp(firebaseConfig);
 export const db = getFirestore(app);
 export const storage = getStorage(app);
