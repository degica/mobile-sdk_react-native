import { API_HEADER, BASE_URL_API } from "../util/constants";
import { getMonthYearFromExpiry, printLog } from "../util/helpers";
import {
  payForSessionProps,
  PaymentType,
  SessionPayResponseType,
} from "../util/types";

/**
 * Processes a payment for a given session.
 * @param {object} params - The parameters for processing the payment.
 * @param {string} params.publicKey - The public key for authorization.
 * @param {string} params.sessionId - The session ID for the payment.
 * @param {PaymentType} params.paymentType - The type of payment to process.
 * @param {object} params.paymentDetails - The details of the relevant payment type.
 * @param {string} params.paymentDetails.cardholderName - The name of the cardholder.
 * @param {string} params.paymentDetails.cardNumber - The card number.
 * @param {string} params.paymentDetails.cardExpiredDate - The expiration date of the card.
 * @param {string} params.paymentDetails.cardCVV - The CVV of the card.
 * @param {string} params.paymentDetails.name - The Name on the receipt in Konbini payment.
 * @param {string} params.paymentDetails.email - Email for the Konbini payment
 * @returns {Promise<object|null>} The response data from the payment API or null if an error occurs.
 */

const payForSession = async ({
  publicKey,
  sessionId,
  paymentType,
  paymentDetails,
}: payForSessionProps): Promise<SessionPayResponseType | null> => {
  try {
    // pay for a session using /pay API documentation https://doc.komoju.com/reference/post_sessions-id-pay
    const url = `${BASE_URL_API}/sessions/${sessionId}/pay`;

    let payment_details = {};

    // creating payment_details payload according to different payment types
    switch (paymentType) {
      // credit card payment type payment type
      case PaymentType.CREDIT:
        // refactoring input data from user to separate month and year
        const { month, year } = getMonthYearFromExpiry(
          paymentDetails?.cardExpiredDate || ""
        );
        // refactoring number to remove all unsavory empty spaces from credit card number
        const number = paymentDetails?.cardNumber?.replaceAll(" ", "");

        // credit card payment_details mandatory parameters type, number, month, year
        payment_details = {
          type: PaymentType.CREDIT,
          name: paymentDetails?.cardholderName,
          number,
          month,
          year,
          verification_value: paymentDetails?.cardCVV,
        };
        break;
      // paypay payment type payment type
      case PaymentType.PAY_PAY:
        // paypay payment_details mandatory parameters type only
        payment_details = {
          type: PaymentType.PAY_PAY,
        };
        break;
      // konbini payment type payment type
      case PaymentType.KONBINI:
        // konbini payment_details mandatory parameters type and email
        payment_details = {
          type: PaymentType.KONBINI,
          store: paymentDetails?.selectedStore,
          name: paymentDetails?.name,
          email: paymentDetails?.email,
        };
        break;
      default:
        break;
    }

    // payment POST request options of headers and body should be as bellow
    const options = {
      method: "POST",
      headers: API_HEADER(publicKey),
      body: JSON.stringify({
        capture: "auto",
        payment_details,
      }),
    };

    const response = await fetch(url, options);
    // converting the above response to jason format
    const data = await response.json();

    return data;
  } catch (e) {
    // logging out any exceptions for debugging
    printLog({
      logName: "Error:",
      message: "Unable to Process Payment",
    });
    return null;
  }
};

export default payForSession;
