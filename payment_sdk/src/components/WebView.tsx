import React from "react";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";

import { newNavStateProps } from "../util/types";

type webViewProps = {
  link: string;
  onNavigationStateChange?: (data: newNavStateProps) => void;
};

const WebViewComponent = ({ link, onNavigationStateChange }: webViewProps) => {
  return (
    <WebView
      source={{
        uri: link,
      }}
      style={styles.container}
      startInLoadingState
      onNavigationStateChange={onNavigationStateChange}
    />
  );
};

export default WebViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
