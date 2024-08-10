import React, { useReducer } from "react";

import { DispatchContext, StateContext, reducer } from "@context/state";

import { initialState, KomojuProviderIprops } from "@util/types";

import "@assets/languages/i18n";
import { MainStateProvider } from "./MainStateProvider";
import { ThemeProvider } from "./ThemeContext";

export const KomojuProvider = (props: KomojuProviderIprops) => {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ThemeProvider>
          <MainStateProvider
            publicKey={props.publicKey}
            payment_methods={props?.payment_methods}
            language={props?.language}
          >
            {props.children}
          </MainStateProvider>
        </ThemeProvider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};
