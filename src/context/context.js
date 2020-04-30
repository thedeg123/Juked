import React from "react";
import useFiresore from "../hooks/useFirestore";
import useMusic from "../hooks/useMusic";

const context = React.createContext();

export const Provider = ({ children }) => {
  const dbs = {
    firestore: new useFiresore(),
    useMusic: new useMusic()
  };
  return <context.Provider value={dbs}>{children}</context.Provider>;
};

export default context;
