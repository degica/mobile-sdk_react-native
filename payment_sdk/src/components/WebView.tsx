import React from "react";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";

type webViewProps = {
  link: string;
};

const WebViewComponent = ({ link }: webViewProps) => {
  return (
    <WebView
      source={{
        uri: link,
      }}
      style={styles.container}
      startInLoadingState
    />
  );
};

export default WebViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 110,
  },
});
