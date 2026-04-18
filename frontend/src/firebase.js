import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-irlelJQNBN_BMVQk76XGsHXCZR2XvPo",
  authDomain: "placementguide-e8f9f.firebaseapp.com",
  projectId: "placementguide-e8f9f",
  storageBucket: "placementguide-e8f9f.firebasestorage.app",
  messagingSenderId: "618664406144",
  appId: "1:618664406144:web:bdf44c3eecf2b8d0840a65",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();