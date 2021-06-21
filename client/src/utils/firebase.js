import firebase from "firebase/app"
import "firebase/storage"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: "swapify-85d2c",
    storageBucket: "swapify-85d2c.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
  };

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()
const firestore = firebase.firestore()

export { storage, firebase, firestore, firebase as default} 