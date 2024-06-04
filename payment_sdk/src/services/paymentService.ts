// create payments must be implmented here
import { BASE_URL } from "../util/constants";
import { getMonthYearFromExpiry } from "../util/helpers";
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
        const number = cardDetails?.cardNumber.replace(/-/g, "");

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
    const rspJson = await response.json();

    console.log("response>>");
    console.log(options);
    console.log(rspJson);
    return rspJson;
  } catch (e) {
    console.warn("Unable to Process Payment");
    return null;
  }
};

export default payForSession;
