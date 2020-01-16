import createDataContext from "./CreateDataContext";

const authReducer = (state, action) => {
  switch (action.type) {
    case "sign_in":
      return { ...state, msg: action.payload };
    default:
      return state;
  }
};

const signin = disatch => () => {
  return disatch({ type: "sign_in", payload: "Signed in!" });
};
//signout,
//signup,
//clearErrorMessage,
//tryLocalSignin;
export const { Provider, Context } = createDataContext(
  authReducer,
  { signin },
  { token: null, msg: "" }
);
