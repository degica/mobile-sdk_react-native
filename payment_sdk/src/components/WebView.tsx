import React, { useContext } from "react";
import { WebView } from "react-native-webview";
import { Alert, StyleSheet } from "react-native";

import { checkSecureTokenStatus } from "../services/secureTokenService";
import { Actions, DispatchContext } from "../state";
import paymentService from "../services/paymentService";
import { initialState } from "../util/types";

type webViewProps = {
  link: string;
};

type newNavStateProps = {
  url?: string;
  title?: string;
  loading?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
};

const parameterName = "secure_token_id=";

const WebViewComponent = ({ link }: webViewProps) => {
  const dispatch = useContext(DispatchContext);

  const handleWebViewNavigationStateChange = async (
    newNavState: newNavStateProps
  ) => {
    const { url } = newNavState;
    if (!url) return;

    //Check if URL includes secure_token_id=
    if (url.includes(parameterName)) {
      //CLose web view and start loading
      dispatch({
        type: Actions.SET_WEBVIEW_LINK,
        payload: "",
      });
      dispatch({
        type: Actions.SET_LOADING,
        payload: true,
      });

      const token = url.substring(
        url.indexOf(parameterName) + parameterName.length
      );

      const tokenResponse = await checkSecureTokenStatus(token);

      if (tokenResponse?.verification_status === "OK") {
        const paymentResponse = await paymentService({
          token: tokenResponse?.id,
        });

        if (paymentResponse?.status === "captured") {
          dispatch({
            type: Actions.RESET_STATES,
            payload: initialState,
          });
          Alert.alert("Success", "The payment was confirmed successfully");
        } else {
          Alert.alert("Error", "Unable to Process Payment");
        }
      } else {
        Alert.alert("Error", "3D Secure payment failed please try again");
      }

      dispatch({
        type: Actions.SET_LOADING,
        payload: false,
      });
    }
  };

  return (
    <WebView
      source={{
        uri: link,
      }}
      style={styles.container}
      startInLoadingState
      onNavigationStateChange={handleWebViewNavigationStateChange}
    />
  );
};

export default WebViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
