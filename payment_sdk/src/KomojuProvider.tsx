import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import { Alert } from "react-native";

import {
  CreatePaymentFuncType,
  initialState,
  InitPrams,
  newNavStateProps,
  PaymentStatuses,
  PaymentType,
  ResponseScreenStatuses,
  sessionPayProps,
  TokenResponseStatuses,
  webViewDataInitialState,
} from "./util/types";
import { PaymentSheetRefProps } from "./components/PaymentSheet";

import { Actions, DispatchContext, KomojuContext } from "./state";
import StateProvider from "./components/paymentState/stateProvider";
import payForSession from "./services/payForSessionService";
import sessionShow from "./services/sessionShow";
import { validateSessionResponse } from "./util/validator";
import secureTokenService, {
  checkSecureTokenStatus,
} from "./services/secureTokenService";
import { parameterName } from "./util/constants";
import paymentService from "./services/paymentService";
import Sheet from "./components/Sheet";

type KomojuProviderIprops = {
  children?: ReactNode | ReactNode[];
} & InitPrams;

export const KomojuProvider = (props: KomojuProviderIprops) => {
  return (
    <StateProvider>
      <MainStateProvider
        urlScheme={props.urlScheme}
        publicKey={props.publicKey}
      >
        {props.children}
      </MainStateProvider>
    </StateProvider>
  );
};

export const MainStateProvider = (props: KomojuProviderIprops) => {
  const dispatch = useContext(DispatchContext);

  const sheetRef = useRef<PaymentSheetRefProps>(null);

  // when payment is success global state is rest and invoking the success screen
  const onPaymentSuccess = () => {
    dispatch({
      type: Actions.RESET_STATES,
      payload: initialState,
    });
    dispatch({
      type: Actions.SET_PAYMENT_STATE,
      payload: ResponseScreenStatuses.SUCCESS,
    });
  };

  // when payment is failed invoking the error screen
  const onPaymentFailed = () =>
    dispatch({
      type: Actions.SET_PAYMENT_STATE,
      payload: ResponseScreenStatuses.FAILED,
    });

  // showing overlay loading indicator disabling all interactions
  const startLoading = () =>
    dispatch({
      type: Actions.SET_LOADING,
      payload: true,
    });

  // Hiding overlay loading indicator
  const stopLoading = () =>
    dispatch({
      type: Actions.SET_LOADING,
      payload: false,
    });

  // validating the provided session ID by user before proceeding
  const validateSession = async (sessionId: string) => {
    startLoading();

    // Fetching session data from given session ID
    const sessionData = await sessionShow({
      sessionId,
      publicKey: props.publicKey,
    });

    // validating the session data and closing the payment gateway if data is not valid
    if (validateSessionResponse(sessionData)) {
      sheetRef?.current?.close();
      Alert.alert("Error", "Session expired");
    } else {
      // if session is valid setting amount, currency type at global store for future use
      dispatch({ type: Actions.SET_AMOUNT, payload: sessionData?.amount });
      dispatch({ type: Actions.SET_CURRENCY, payload: sessionData?.currency });
    }
    stopLoading();
  };

  // Session pay callback. this method handles all the payment logic and APIs
  const sessionPay = ({
    sessionId,
    onComplete,
    enablePayWithoutSession = false,
    secretKey,
  }: CreatePaymentFuncType) => {
    return async ({ paymentType, cardDetails }: sessionPayProps) => {
      // This callback method is used to intercept Web View urls
      const handleWebViewNavigationStateChange = async (
        newNavState: newNavStateProps
      ) => {
        const { url } = newNavState;
        if (!url) return;

        // Check if URL includes secure_token_id=
        if (url.includes(parameterName)) {
          // CLose web view and start loading
          dispatch({
            type: Actions.SET_WEBVIEW_LINK,
            payload: webViewDataInitialState,
          });
          startLoading();

          // check if user wants manual 3D secure flow or session pay flow
          if (!enablePayWithoutSession) {
            // if this is a session flow, check until session response changes from 'pending' to 'completed' or 'error'
            const sessionShowPayload = {
              publicKey: props.publicKey,
              sessionId: sessionId,
            };

            // fetch session status to check if the payment is completed
            let sessionResponse = await sessionShow(sessionShowPayload);

            // Polling until session verification status changes
            while (
              sessionResponse?.secure_token?.verification_status ===
              TokenResponseStatuses.PENDING
            ) {
              sessionResponse = await sessionShow(sessionShowPayload);
            }

            // if payment success showing success screen or if failed showing error screen
            if (
              sessionResponse?.secure_token?.verification_status ===
              TokenResponseStatuses.SUCCESS
            ) {
              onPaymentSuccess();
            } else {
              onPaymentFailed();
            }

            // calling user passed onComplete method with session response data
            onComplete && onComplete(sessionResponse);
          } else {
            //This is for manual 3D secure token handling flow

            // getting secure_token_id parameter from the web view URL
            const token = url.substring(
              url.indexOf(parameterName) + parameterName.length
            );

            // checking token status if the 3D secure has passed
            const tokenResponse = await checkSecureTokenStatus({
              token,
              secretKey,
            });

            // check if the response is at success or failed status
            if (
              tokenResponse?.verification_status ===
              TokenResponseStatuses.SUCCESS
            ) {
              // if 3D secure is passed initiate the payment fetch call
              const paymentResponse = await paymentService({
                token: tokenResponse?.id,
                amount: "2000",
                currency: "JPY",
                secretKey,
              });

              // if payment success showing success screen or if failed showing error screen
              if (paymentResponse?.status === TokenResponseStatuses.CAPTURED) {
                onPaymentSuccess();
              } else {
                onPaymentFailed();
              }
            } else {
              // if 3D secure check is failed showing error screen
              onPaymentFailed();
            }
            // End of manual 3D secure token handling flow
          }

          // after all api calls are done stopping the loading indicator
          stopLoading();
        }
      };

      // Start of the payment handling method
      startLoading();

      // Note: this is for testing 3D Secure Without a Session purposes only, remove at production
      // Check if user wants manual 3D secure and is credit card payment method selected
      if (paymentType === PaymentType.CREDIT && enablePayWithoutSession) {
        const response = await secureTokenService({
          cardDetails,
          secretKey,
        });

        stopLoading();

        if (response?.verification_status === TokenResponseStatuses.PENDING) {
          dispatch({
            type: Actions.SET_WEBVIEW_LINK,
            payload: {
              link: response.authentication_url,
              onNavChange: handleWebViewNavigationStateChange,
            },
          });
        } else if (response?.status === TokenResponseStatuses.ERROR) {
          onPaymentFailed();
        } else {
          onPaymentSuccess();
        }

        return;
      }
      //End Note

      // initiate payment for the session ID with payment details
      const response = await payForSession({
        paymentType,
        sessionId,
        publicKey: props.publicKey,
        cardDetails,
      });

      stopLoading();

      if (response?.status === PaymentStatuses.PENDING) {
        dispatch({
          type: Actions.SET_WEBVIEW_LINK,
          payload: {
            link: response.redirect_url,
            onNavChange: handleWebViewNavigationStateChange,
          },
        });
      } else if (response?.status === PaymentStatuses.SUCCESS) {
        onPaymentSuccess();
      } else {
        onPaymentFailed();
      }
    };
  };

  const createPayment = useCallback(
    ({
      sessionId,
      onComplete,
      secretKey,
      enablePayWithoutSession,
    }: CreatePaymentFuncType) => {
      dispatch({
        type: Actions.RESET_STATES,
        payload: initialState,
      });

      if (!enablePayWithoutSession) validateSession(sessionId);

      dispatch({
        type: Actions.SESSION_PAY,
        payload: sessionPay({
          sessionId,
          onComplete,
          enablePayWithoutSession,
          secretKey,
        }),
      });
      sheetRef?.current?.open();
    },
    [props]
  );

  const showPaymentSheetUI = useCallback(() => {
    // take params from state or props
  }, []);

  const initializeKomoju = useCallback((params: InitPrams) => {}, []);

  const renderPaymentUI = useMemo(() => {
    const UI = <Sheet ref={sheetRef} />;
    return UI;
  }, [sheetRef]);

  const renderChildren = useMemo(() => props?.children, [props.children]);

  return (
    <KomojuContext.Provider
      value={{
        createPayment,
        showPaymentSheetUI,
        initializeKomoju,
      }}
    >
      {renderChildren}
      {renderPaymentUI}
    </KomojuContext.Provider>
  );
};
