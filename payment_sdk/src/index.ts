import { useContext } from "react";

import { KomojuProvider } from "./KomojuProvider";
import { KomojuContext } from "./state";

export const KomojuSDK = {
  useKomoju: () => useContext(KomojuContext), // for functional components use this
  komojuConsumer: KomojuContext.Consumer, // for class components use this
  KomojuProvider: KomojuProvider, // wrap the react native entry point with this
};
