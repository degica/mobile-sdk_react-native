import { useContext } from "react";

import { CardDetailsType, TokenResponseStatuses } from "../util/types";
import { Actions, DispatchContext, StateContext } from "../context/state";
import { getMonthYearFromExpiry, openURL } from "../util/helpers";
import { generateToken } from "../services/secureTokenService";
import { BASE_URL } from "../util/constants";
import useMainStateUtils from "./useMainStateUtils";

const useThreeDSecureHandler = () => {
  const dispatch = useContext(DispatchContext);

  const { amount, currency, providerPropsData } = useContext(StateContext);
  const { startLoading, stopLoading, onPaymentFailed } = useMainStateUtils();

  const threeDSecurePayment = async (paymentDetails: CardDetailsType) => {
    startLoading();

    const { month, year } = getMonthYearFromExpiry(
      paymentDetails?.cardExpiredDate || ""
    );

    const token = await generateToken({
      publishableKey: providerPropsData?.publishableKey,
      amount: amount,
      currency: currency,
      return_url: providerPropsData?.urlScheme ?? BASE_URL,
      cardNumber: paymentDetails?.cardNumber ?? "",
      month: month ?? "",
      year: year ?? "",
      cardCVV: paymentDetails?.cardCVV ?? "",
      cardholderName: paymentDetails?.cardholderName ?? "",
    });

    stopLoading();

    if (token?.verification_status === TokenResponseStatuses.PENDING) {
      dispatch({
        type: Actions.SET_TOKEN_ID,
        payload: token.id,
      });

      openURL(token.authentication_url);
    } else if (
      token?.verification_status === TokenResponseStatuses.SUCCESS ||
      token?.verification_status === TokenResponseStatuses.SKIPPED
    ) {
      // call payments api
    } else {
      onPaymentFailed();
    }
  };

  return {
    threeDSecurePayment,
  };
};

export default useThreeDSecureHandler;
