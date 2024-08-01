import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { Alert, Linking } from "react-native";

import i18next from "i18next";

import Sheet, { SheetRefProps } from "@components/Sheet";

import payForSession from "@services/payForSessionService";
import sessionShow from "@services/sessionShow";

import { parsePaymentMethods } from "@util/helpers";
import {
  CreatePaymentFuncType,
  initialState,
  InitPrams,
  KomojuProviderIprops,
  PaymentStatuses,
  ResponseScreenStatuses,
  sessionPayProps,
} from "@util/types";
import { validateSessionResponse } from "@util/validator";

import "@assets/languages/i18n";
import { Actions, DispatchContext, KomojuContext } from "./state";

export const MainStateProvider = (props: KomojuProviderIprops) => {
  const dispatch = useContext(DispatchContext);

  const sheetRef = useRef<SheetRefProps>(null);
  // ref to hold client provided onComplete callback
  const onCompleteCallback = useRef(null);
  // ref to hold client provided onDismiss callback
  const onDismissCallback = useRef(null);
  // ref to hold client provided session Id
  const sessionIdRef = useRef("");

  useEffect(() => {
    // Add event listener for deep links
    const subscription = Linking.addEventListener(
      "url",
      handleDeepLinkStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

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

  const openURL = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert("Redirection not working. Please contact support!");
    }
  };

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
      if (props?.language) {
        i18next.changeLanguage(props?.language);
      } else {
        i18next.changeLanguage(sessionData?.default_locale);
      }

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
  const handleDeepLinkStateChange = async () => {
    startLoading();

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
      if (sessionResponse?.payment?.payment_details?.instructions_url) {
        openURL(sessionResponse?.payment?.payment_details?.instructions_url);
      }
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
        openURL(response.redirect_url);
      } else if (
        response?.status === PaymentStatuses.SUCCESS &&
        response?.payment?.payment_details?.instructions_url
      ) {
        openURL(response?.payment?.payment_details?.instructions_url);
        onPaymentSuccess();
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
