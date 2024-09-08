import { KomojuProviderIprops } from "../util/types";

import "../assets/languages/i18n";
import { MainStateProvider } from "./MainStateProvider";
import StateProvider from "./StateProvider";
import { ThemeProvider } from "./ThemeContext";

export const KomojuProvider = (props: KomojuProviderIprops) => {
  return (
    <StateProvider>
      <ThemeProvider theme={props?.theme} darkMode={props?.darkMode}>
        <MainStateProvider
          publishableKey={props.publishableKey}
          paymentMethods={props?.paymentMethods}
          language={props?.language}
          useBottomSheet={props?.useBottomSheet}
        >
          {props.children}
        </MainStateProvider>
      </ThemeProvider>
    </StateProvider>
  );
};
