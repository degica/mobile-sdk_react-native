import { useContext } from "react";
import { Alert } from "react-native";
import i18next from "i18next";

import {
  CurrencyTypes,
  KomojuProviderIprops,
  PaymentMode,
} from "../util/types";
import sessionShow from "../services/sessionShow";
import { validateSessionResponse } from "../util/validator";
import { Actions, DispatchContext } from "../context/state";
import { parsePaymentMethods } from "../util/helpers";

type Props = {
  props: KomojuProviderIprops;
  startLoading: () => void;
  stopLoading: () => void;
  closePaymentSheet: () => void;
};

const useValidationHandler = ({
  props,
  startLoading,
  stopLoading,
  closePaymentSheet,
}: Props) => {
  const dispatch = useContext(DispatchContext);

  // validating the provided session ID by user before proceeding
  const validateSession = async (sessionId: string) => {
    startLoading();

    // Fetching session data from given session ID
    const sessionData = await sessionShow({
      sessionId,
      publishableKey: props.publishableKey,
    });

    // validating the session data and closing the payment gateway if data is not valid
    if (validateSessionResponse(sessionData)) {
      closePaymentSheet();
      Alert.alert("Error", "Invalid Session");
    } else {
      // if explicitly language is not set. set to the localization from session
      if (props?.language) {
        i18next.changeLanguage(props?.language);
      } else {
        i18next.changeLanguage(sessionData?.default_locale);
      }

      // if user provided explicitly payments methods via props, will give priority to that over session payment methods
      const paymentMethods = parsePaymentMethods(
        props?.paymentMethods,
        sessionData?.payment_methods ?? []
      );

      dispatch({
        type: Actions.SET_SESSION_DATA,
        payload: {
          amount: String(sessionData?.amount),
          currency: sessionData?.currency ?? CurrencyTypes.JPY,
          paymentMethods: paymentMethods,
          mode: sessionData?.mode ?? PaymentMode.Payment,
        },
      });

      // setting the current selected payment method as the first payment method on the list
      dispatch({
        type: Actions.SET_PAYMENT_OPTION,
        payload: paymentMethods ? paymentMethods[0]?.type : "",
      });
    }
    stopLoading();
  };

  return {
    validateSession,
  };
};

export default useValidationHandler;
