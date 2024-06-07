import { BASE_URL } from "../util/constants";
import { getMonthYearFromExpiry, printLog } from "../util/helpers";
import { payForSessionProps, PaymentType } from "../util/types";

/**
 * Processes a payment for a given session.
 * @param {object} params - The parameters for processing the payment.
 * @param {string} params.publicKey - The public key for authorization.
 * @param {string} params.sessionId - The session ID for the payment.
 * @param {PaymentType} params.paymentType - The type of payment to process.
 * @param {object} params.cardDetails - The details of the card for credit card payments.
 * @param {string} params.cardDetails.cardholderName - The name of the cardholder.
 * @param {string} params.cardDetails.cardNumber - The card number.
 * @param {string} params.cardDetails.cardExpiredDate - The expiration date of the card.
 * @param {string} params.cardDetails.cardCVV - The CVV of the card.
 * @returns {Promise<object|null>} The response data from the payment API or null if an error occurs.
 */

const payForSession = async ({
  publicKey,
  sessionId,
  paymentType,
  cardDetails,
}: payForSessionProps) => {
  try {
    const url = `${BASE_URL}/sessions/${sessionId}/pay`;

    let paymentDetails = {};

    switch (paymentType) {
      case PaymentType.CREDIT:
        const { month, year } = getMonthYearFromExpiry(
          cardDetails?.cardExpiredDate || ""
        );
        const number = cardDetails?.cardNumber.replaceAll(" ", "");

        paymentDetails = {
          type: "credit_card",
          name: cardDetails?.cardholderName,
          number,
          month,
          year,
          verification_value: cardDetails?.cardCVV,
        };
        break;
      case PaymentType.PAY_PAY:
        paymentDetails = {
          type: "paypay",
        };
        break;
      default:
        break;
    }

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${btoa(publicKey + ":")}`,
      },
      body: JSON.stringify({
        capture: "auto",
        payment_details: paymentDetails,
      }),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    return data;
  } catch (e) {
    printLog({
      logName: "Error:",
      message: "Unable to Process Payment",
    });
    return null;
  }
};

export default payForSession;
