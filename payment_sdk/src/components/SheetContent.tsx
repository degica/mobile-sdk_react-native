import React, { useContext } from "react";
import { ScrollView } from "react-native";
import { WebView } from "react-native-webview";

import PillContainer from "./PillContainer";
import CardSection from "./sections/CardSection";
import PayPaySection from "./sections/PayPaySection";
import { StateContext } from "../state";

const SheetContent = () => {
  const { webViewLink } = useContext(StateContext);

  const [selectedPill, setSelectedPill] = React.useState(0);

  const handlePillSelect = (index: number) => {
    setSelectedPill(index);
  };

  if (webViewLink)
    return (
      <WebView
        source={{
          uri: webViewLink,
        }}
        style={{ flex: 1, marginBottom: 110 }}
        startInLoadingState
      />
    );

  return (
    <ScrollView>
      <PillContainer onSelect={handlePillSelect} selectedItem={selectedPill} />
      {selectedPill === 0 && <CardSection />}
      {selectedPill === 2 && <PayPaySection />}
    </ScrollView>
  );
};

export default SheetContent;
