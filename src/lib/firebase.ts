import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAlPcIm4bx-jJ9cdJ5V53acvxCXhZsF-as",
  authDomain: "qr-attendance-9a471.firebaseapp.com",
  projectId: "qr-attendance-9a471",
  storageBucket: "qr-attendance-9a471.firebasestorage.app",
  messagingSenderId: "115035894761",
  appId: "1:115035894761:web:c1b37bffd275857eac9178",
  measurementId: "G-4EPK8K9GQ9"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const checkDocumentExists = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error(`Error checking document existence in ${collectionName}:`, error);
    return false;
  }
};