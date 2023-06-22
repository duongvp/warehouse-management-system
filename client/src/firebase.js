// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCLuGcsyo8jEv05PJgeYmu3mPr6O_i_aM",
  authDomain: "warehouseadmin-bd548.firebaseapp.com",
  projectId: "warehouseadmin-bd548",
  storageBucket: "warehouseadmin-bd548.appspot.com",
  messagingSenderId: "342066161083",
  appId: "1:342066161083:web:d47a5eb5d477de0878109e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firebase storage reference
const storage = getStorage(app);
export default storage;