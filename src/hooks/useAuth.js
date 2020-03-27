import { useState } from "react";
import firebase from "firebase";
import "firebase/firestore";

export default () => {
  const [error, setError] = useState("");

  const signin = async (email, password) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => remove_error())
      .catch(err => {
        console.log(err, err.code);
        switch (err.code) {
          default:
            setError(err.message);
        }
      });
  };
  const signup = async (email, password, verifyPassword) => {
    let db = firebase.firestore();
    if (password === verifyPassword) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => remove_error())
        .then(() =>
          db
            .collection("users")
            .doc(email)
            .set({
              email,
              handle: "",
              bio: "",
              profile_url: "",
              created: Date.now(),
              followers: [],
              following: []
            })
            .catch(err => setError(err.message))
        )
        .catch(err => setError(err.message));
    } else setError("Passwords do not Match!");
  };
  const signout = async () => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        remove_error();
      })
      .catch(err => {
        console.log(err, err.code);
        switch (err.code) {
          default:
            return setError(err.message);
        }
      });
  };
  const remove_error = () => {
    setError("");
  };
  return { error, signin, signup, signout, remove_error };
};
