import firebase from 'firebase/compat/app';
import {getDatabase} from 'firebase/database';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCc3Bi2shNmnGN5QwG4Z9UN-EgFmbUpqtk",
  authDomain: "motoguard-34a8b.firebaseapp.com",
  projectId: "motoguard-34a8b",
  storageBucket: "motoguard-34a8b.appspot.com",
  messagingSenderId: "812412995184",
  appId: "1:812412995184:web:f82e5f2fa8f6794af696b5"

};


if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();

export { db }
