import { KomojuProviderIprops } from "../util/types";

import "../assets/languages/i18n";
import { MainStateProvider } from "./MainStateProvider";
import StateProvider from "./StateProvider";
import { ThemeProvider } from "./ThemeContext";

export const KomojuProvider = (props: KomojuProviderIprops) => {
  const { theme, children, ...restProps } = props;

  return (
    <StateProvider>
      <ThemeProvider theme={props?.theme}>
        <MainStateProvider {...restProps}>{props.children}</MainStateProvider>
      </ThemeProvider>
    </StateProvider>
  );
};
