// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
const isDev = process.env.NODE_ENV === "development";

const firebaseConfig = isDev ? {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_LOCAL_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_LOCAL_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_LOCAL_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_LOCAL_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_LOCAL_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_LOCAL_APP_ID,
} : {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_VERCEL_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_VERCEL_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_VERCEL_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_VERCEL_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_VERCEL_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_VERCEL_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);