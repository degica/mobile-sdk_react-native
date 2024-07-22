import React from "react";

import { StyleSheet } from "react-native";

import { WebView } from "react-native-webview";

import { newNavStateProps } from "@util/types";

import { responsiveScale } from "@theme/scalling";

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
    marginBottom: responsiveScale(10),
  },
});
