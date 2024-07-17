import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

import { Alert } from "react-native";

import i18next from "i18next";

import StateProvider from "@components/paymentState/stateProvider";
import Sheet, { SheetRefProps } from "@components/Sheet";

import payForSession from "@services/payForSessionService";
import sessionShow from "@services/sessionShow";

import { sessionParameterName, tokenParameterName } from "@util/constants";
import { parsePaymentMethods } from "@util/helpers";
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
} from "@util/types";
import { validateSessionResponse } from "@util/validator";

import "@assets/languages/i18n";
import { Actions, DispatchContext, KomojuContext } from "./state";

type KomojuProviderIprops = {
  children?: ReactNode | ReactNode[];
} & InitPrams;

export const KomojuProvider = (props: KomojuProviderIprops) => {
  if (props?.language) i18next.changeLanguage(props?.language);
  return (
    <StateProvider>
      <MainStateProvider
        publicKey={props.publicKey}
        payment_methods={props?.payment_methods}
        language={props?.language}
      >
        {props.children}
      </MainStateProvider>
    </StateProvider>
  );
};

export const MainStateProvider = (props: KomojuProviderIprops) => {
  const dispatch = useContext(DispatchContext);

  const sheetRef = useRef<SheetRefProps>(null);
  // ref to hold client provided onComplete callback
  const onCompleteCallback = useRef(null);
  // ref to hold client provided onDismiss callback
  const onDismissCallback = useRef(null);
  // ref to hold client provided session Id
  const sessionIdRef = useRef("");

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

  const onUserCancel = async () => {
    if (onDismissCallback.current) {
      const sessionShowPayload = {
        publicKey: props?.publicKey,
        sessionId: sessionIdRef.current,
      };

      // fetch session status to check if the payment is completed
      const sessionResponse = await sessionShow(sessionShowPayload);
      // invoking client provided onDismiss callback
      // TODO: Fix this type error
      // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
      onDismissCallback.current(sessionResponse);
    }
  };

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
      // TODO: Fix this type error
      // @ts-expect-error - Object is possibly 'null'.
      sheetRef?.current?.close(false);
      Alert.alert("Error", "Invalid Session");
    } else {
      // if explicitly language is not set. set to the localization from session
      if (!props?.language) i18next.changeLanguage(sessionData?.default_locale);

      // if session is valid setting amount, currency type at global store for future use
      dispatch({ type: Actions.SET_AMOUNT, payload: sessionData?.amount });
      dispatch({ type: Actions.SET_CURRENCY, payload: sessionData?.currency });

      // if user provided explicitly payments methods via props, will give priority to that over session payment methods
      const paymentMethods = parsePaymentMethods(
        props?.payment_methods,
        sessionData?.payment_methods
      );

      // setting the payment methods in global state
      dispatch({
        type: Actions.SET_PAYMENT_METHODS,
        payload: paymentMethods,
      });
      // setting the current selected payment method as the first payment method on the list
      dispatch({
        type: Actions.SET_PAYMENT_OPTION,
        payload: paymentMethods ? paymentMethods[0]?.type : "",
      });
    }
    stopLoading();
  };

  // This callback method is used to intercept Web View urls
  const handleWebViewNavigationStateChange = async (
    newNavState: newNavStateProps,
    paymentType: PaymentType
  ) => {
    const { url } = newNavState;
    if (!url) return;

    // Check if its credit card method URL includes secure_token_id=
    if (
      (url.includes(tokenParameterName) ||
        url.includes(sessionParameterName)) &&
      paymentType === PaymentType.CREDIT
    ) {
      // CLose web view and start loading
      dispatch({
        type: Actions.SET_WEBVIEW_LINK,
        payload: webViewDataInitialState,
      });
      startLoading();

      // if this is a session flow, check until session response changes from 'pending' to 'completed' or 'error'
      const sessionShowPayload = {
        publicKey: props.publicKey,
        sessionId: sessionIdRef.current,
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
        // calling user passed onComplete method with session response data
        onCompleteCallback.current &&
          // TODO: Fix this type error
          // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
          onCompleteCallback.current(sessionResponse);
      } else {
        onPaymentFailed();
      }

      // after all api calls are done stopping the loading indicator
      stopLoading();

      // if paypay payment method web view redirection flow
    } else if (
      url.includes(sessionParameterName) &&
      paymentType === PaymentType.PAY_PAY
    ) {
      // if this is a session flow, check until session response changes from 'pending' to 'completed' or 'error'
      const sessionShowPayload = {
        publicKey: props.publicKey,
        sessionId: sessionIdRef.current,
      };

      // fetch session status to check if the payment is completed
      let sessionResponse = await sessionShow(sessionShowPayload);

      // Polling until session verification status changes
      while (sessionResponse?.status === PaymentStatuses.PENDING) {
        sessionResponse = await sessionShow(sessionShowPayload);
      }

      // if payment success showing success screen or if failed showing error screen
      if (sessionResponse?.status === PaymentStatuses.SUCCESS) {
        onPaymentSuccess();
        // calling user passed onComplete method with session response data
        onCompleteCallback.current &&
          // TODO: Fix this type error
          // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
          onCompleteCallback.current(sessionResponse);
      } else {
        onPaymentFailed();
      }
    }
  };

  // Session pay callback. this method handles all the payment logic and APIs
  const sessionPay = ({ sessionId }: CreatePaymentFuncType) => {
    return async ({ paymentType, paymentDetails }: sessionPayProps) => {
      // Start of the payment handling method
      startLoading();

      // initiate payment for the session ID with payment details
      const response = await payForSession({
        paymentType,
        sessionId,
        publicKey: props.publicKey,
        paymentDetails,
      });

      stopLoading();

      if (response?.status === PaymentStatuses.PENDING) {
        dispatch({
          type: Actions.SET_WEBVIEW_LINK,
          payload: {
            link: response.redirect_url,
            onNavChange: (newNavState: newNavStateProps) =>
              handleWebViewNavigationStateChange(newNavState, paymentType),
          },
        });
      } else if (
        paymentType === PaymentType.KONBINI &&
        response?.payment?.payment_details?.instructions_url
      ) {
        dispatch({
          type: Actions.SET_WEBVIEW_LINK,
          payload: {
            link: response?.payment?.payment_details?.instructions_url,
            onNavChange: (newNavState: newNavStateProps) =>
              handleWebViewNavigationStateChange(newNavState, paymentType),
          },
        });
        dispatch({
          type: Actions.SET_PAYMENT_STATE,
          payload: ResponseScreenStatuses.COMPLETE,
        });
      } else if (response?.status === PaymentStatuses.SUCCESS) {
        onPaymentSuccess();
      } else {
        onPaymentFailed();
      }
    };
  };

  const createPayment = useCallback(
    ({ sessionId, onComplete, onDismiss }: CreatePaymentFuncType) => {
      dispatch({
        type: Actions.RESET_STATES,
        payload: initialState,
      });

      // setting client provided onComplete callback into a ref
      // TODO: Fix this type error
      // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
      onCompleteCallback.current = onComplete;
      // setting client provided onDismiss callback into a ref
      // TODO: Fix this type error
      // @ts-expect-error - Argument of type 'PaymentSessionResponse' is not assignable to parameter of type 'string'.
      onDismissCallback.current = onDismiss;
      // setting client provided session Id and into a ref
      sessionIdRef.current = sessionId;

      validateSession(sessionId);

      dispatch({
        type: Actions.SESSION_PAY,
        payload: sessionPay({
          sessionId,
        }),
      });
      sheetRef?.current?.open();
    },
    [props]
  );

  const showPaymentSheetUI = useCallback(() => {
    // take params from state or props
  }, []);

  // TODO: Fix this type error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const initializeKomoju = useCallback((params: InitPrams) => {}, []);

  const renderPaymentUI = useMemo(() => {
    const UI = <Sheet ref={sheetRef} onDismiss={onUserCancel} />;
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
