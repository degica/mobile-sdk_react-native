import React, { useContext } from "react";
import { ScrollView } from "react-native";

import PillContainer from "./PillContainer";
import WebView from "./WebView";
import CardSection from "./sections/CardSection";
import PayPaySection from "./sections/PayPaySection";
import { StateContext } from "../state";
import Loader from "./Loader";
import SheetFooter from "./sections/SheetFooter";

const SheetContent = () => {
  const { webViewLink, loading } = useContext(StateContext);

  const [selectedPill, setSelectedPill] = React.useState(0);

  const handlePillSelect = (index: number) => {
    setSelectedPill(index);
  };

  const renderLoading = loading ? <Loader /> : null;

  if (webViewLink) return <WebView link={webViewLink} />;

  return (
    <ScrollView>
      <PillContainer onSelect={handlePillSelect} selectedItem={selectedPill} />
      {selectedPill === 0 && <CardSection />}
      {selectedPill === 2 && <PayPaySection />}
      {renderLoading}
      <SheetFooter />
    </ScrollView>
  );
};

export default SheetContent;
