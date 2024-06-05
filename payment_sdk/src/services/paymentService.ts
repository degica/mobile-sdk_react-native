import { BASE_URL } from "../util/constants";
import { getMonthYearFromExpiry, printLog } from "../util/helpers";
import { payForSessionProps, PaymentType } from "../util/types";

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
