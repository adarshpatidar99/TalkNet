import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCjq2TDOrsOawVe2xhmrGfEhkS1mhsTFlI",
  authDomain: "talknet-tn.firebaseapp.com",
  projectId: "talknet-tn",
  storageBucket: "talknet-tn.firebasestorage.app",
  messagingSenderId: "287537938496",
  appId: "1:287537938496:web:5bd77ffaa2d8090ea95fa5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
      