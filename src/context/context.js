import React from "react";
import useFiresore from "../hooks/useFirestore";

const context = React.createContext();

export const Provider = ({ children }) => {
  const firestore = new useFiresore();
  return <context.Provider value={firestore}>{children}</context.Provider>;
};

export default context;
