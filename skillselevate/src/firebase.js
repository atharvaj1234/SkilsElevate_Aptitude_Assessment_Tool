import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "skillselevate.firebaseapp.com",
  projectId: "skillselevate",
  storageBucket: "skillselevate.appspot.com",
  messagingSenderId: "379503586222",
  appId: "1:379503586222:web:f6d2190ec71439026d763f",
  measurementId: "G-WHW2NE1HRP",
};

const defaultprofile =
  "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        profilepicture: user.photoURL,
        exam: null,
        profilescore: 0,
        userdata: {
          CurrentTest: 0,
          testdata: [],
        },
      });
    }
  } catch (err) {
    console.error(err);
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert("Invalid Username or Password");
  }
};
const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    console.log(email);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      profilepicture: defaultprofile,
      exam: null,
      profilescore: 0,
      userdata: {
        CurrentTest: 0,
        testdata: [],
      },
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  signOut(auth);
};

const changePassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;

  if (user) {
    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password", error);
      alert("Error updating password: " + error.message);
    }
  } else {
    alert("No user is currently logged in.");
  }
};

const updateName = async (newName) => {
  const user = auth.currentUser;

  if (user) {
    try {
      // Update the user's display name in Firebase Authentication
      await updateProfile(user, { displayName: newName });

      // Update the user's name in Firestore
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);

      if (!docs.empty) {
        const userDoc = docs.docs[0];
        await updateDoc(doc(db, "users", userDoc.id), { name: newName });
        alert("Name updated successfully!");
      } else {
        throw new Error("User not found in Firestore.");
      }
    } catch (error) {
      console.error("Error updating name", error);
      alert("Error updating name: " + error.message);
    }
  } else {
    alert("No user is currently logged in.");
  }
};

export {
  storage,
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  changePassword,
  updateName,
};
