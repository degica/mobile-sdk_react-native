import React, { ReactNode, useReducer } from "react";

import { DispatchContext, StateContext, reducer } from "../../state";
import { initialState } from "../../util/types";

const StateProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch as any}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default StateProvider;
