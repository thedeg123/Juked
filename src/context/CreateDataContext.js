import React, { useReducer } from "react";

export default (reducer, actions, defaultValue) => {
  const Context = React.createContext();

  const Provider = ({ children }) => {
    const [state, dispactch] = useReducer(reducer, defaultValue);

    const boundActions = {};

    for (let action in actions) {
      boundActions[action] = actions[action](dispactch);
    }
    return (
      <Context.Provider value={{ ...boundActions, state }}>
        {children}
      </Context.Provider>
    );
  };
  return { Context, Provider };
};
