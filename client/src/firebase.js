import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:"AIzaSyBieET4CCwo1owT3MhPZKsLZMNq4LGYnbs",       
  authDomain: "realtime-chat-app-99.firebaseapp.com",
  projectId: "realtime-chat-app-99",
  storageBucket: "realtime-chat-app-99.firebasestorage.app",
  messagingSenderId: "148748420472",
  appId: "1:148748420472:web:582cd33cc6d1d4fd31748d",
};
                                                                   
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
      