// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { browserSessionPersistence, getAuth, GoogleAuthProvider, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDj9M7XBzH7IXUPNcS1TpPucOE9TztYw64",
    authDomain: "taskative.firebaseapp.com",
    projectId: "taskative",
    storageBucket: "taskative.appspot.com",
    messagingSenderId: "874368248434",
    appId: "1:874368248434:web:9fd40b253ecae971d5b0eb",
    measurementId: "G-HSBEQT2CFW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// auth
const auth     = getAuth();
const provider = new GoogleAuthProvider();

// db
const db = getFirestore();



export { auth, provider, db };