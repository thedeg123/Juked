import createDataContext from "./CreateDataContext";
import firebase from "firebase";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_uid":
      return { ...state, uid: action.payload };
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "remove_error":
      return { ...state, errorMessage: "" };
    default:
      return state;
  }
};

const setuid = dispatch => async uid =>
  dispatch({ type: "add_uid", payload: uid });

const signin = dispatch => async (email, password) => {
  await firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      dispatch({ type: "remove_error" });
    })
    .catch(err => {
      console.log(err, err.code);
      switch (err.code) {
        default:
          return dispatch({
            type: "add_error",
            payload: err.message
          });
      }
    });
};
const signup = dispatch => async (email, password, verifyPassword) => {
  password === verifyPassword
    ? await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          dispatch({ type: "remove_error" });
        })
        .catch(err => {
          console.log(err, err.code);
          switch (err.code) {
            default:
              return dispatch({
                type: "add_error",
                payload: err.message
              });
          }
        })
    : dispatch({
        type: "add_error",
        payload: "Passwords do not Match!"
      });
};

const signout = dispatch => async callback => {
  await firebase
    .auth()
    .signOut()
    .then(() => {
      dispatch({ type: "remove_error" });
      callback();
    })
    .catch(err => {
      console.log(err, err.code);
      switch (err.code) {
        default:
          return dispatch({
            type: "add_error",
            payload: err.message
          });
      }
    });
};
const remove_error = dispatch => () => {
  return dispatch({ type: "remove_error" });
};
//signout,
//signup,
//clearErrorMessage,
//tryLocalSignin;
export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout, signup, setuid, remove_error },
  { token: null, errorMessage: "" }
);
