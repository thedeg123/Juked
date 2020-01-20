import createDataContext from "./CreateDataContext";
import firebase from "firebase";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "remove_error":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};

const signin = disatch => async (email, password, callback) => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      disatch({ type: "remove_error" });
      callback();
    })
    .catch(err => {
      console.log(err, err.code);
      switch (err.code) {
        default:
          return disatch({
            type: "add_error",
            payload: err.message
          });
      }
    });
};
const signup = disatch => async (email, password, verifyPassword, callback) => {
  password === verifyPassword
    ? await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          disatch({ type: "remove_error" });
          callback();
        })
        .catch(err => {
          console.log(err, err.code);
          switch (err.code) {
            default:
              return disatch({
                type: "add_error",
                payload: err.message
              });
          }
        })
    : disatch({
        type: "add_error",
        payload: "Passwords do not Match!"
      });
};

const signout = disatch => async callback => {
  await firebase
    .auth()
    .signOut()
    .then(() => {
      disatch({ type: "remove_error" });
      callback();
    })
    .catch(err => {
      console.log(err, err.code);
      switch (err.code) {
        default:
          return disatch({
            type: "add_error",
            payload: err.message
          });
      }
    });
};
const remove_error = disatch => () => {
  return disatch({ type: "remove_error" });
};
//signout,
//signup,
//clearErrorMessage,
//tryLocalSignin;
export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, remove_error },
  { token: null, errorMessage: "" }
);
