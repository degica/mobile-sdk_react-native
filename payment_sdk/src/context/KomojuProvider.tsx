import React from "react";

import i18next from "i18next";

import {
  KomojuProviderIprops,
} from "@util/types";

import "@assets/languages/i18n";
import { MainStateProvider } from "./MainStateProvider";
import StateProvider from "./StateProvider";
import { ThemeProvider } from "./ThemeContext";

export const KomojuProvider = (props: KomojuProviderIprops) => {
  if (props?.language) i18next.changeLanguage(props?.language);
  return (
    <StateProvider>
      <ThemeProvider>
        <MainStateProvider
          publicKey={props.publicKey}
          payment_methods={props?.payment_methods}
          language={props?.language}
        >
          {props.children}
        </MainStateProvider>
      </ThemeProvider>
    </StateProvider>
  );
};