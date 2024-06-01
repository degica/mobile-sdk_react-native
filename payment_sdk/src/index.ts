import { useContext } from "react";
import { View } from "react-native";

import { KomojuContext, KomojuProvider } from "./KomojuProvider";

export const KomojuSDK = {
  useKomoju: () => useContext(KomojuContext), // for functional components use this
  komjouConsumer: KomojuContext.Consumer, // for class components use this
  KomojouProvider: KomojuProvider, // wrap the react native entry point with this
};
