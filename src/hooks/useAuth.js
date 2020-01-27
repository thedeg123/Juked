import { useState } from "react";
import firebase from "firebase";
import useFirestore from "./useFirestore";

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
    password === verifyPassword
      ? await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => remove_error())
          .then(() => {
            useFirestore.addUser(
              email,
              (handle = ""),
              (bio = ""),
              (profile_url = "")
            );
          })
          .catch(err => {
            switch (err.code) {
              default:
                return setError(err.message);
            }
          })
      : setError("Passwords do not Match!");
  };
  const signout = async callback => {
    await firebase
      .auth()
      .signOut()
      .then(() => {
        remove_error();
        callback();
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
