import { SECRET_KEY } from "@env";
import { BASE_URL } from "../util/constants";
import { getMonthYearFromExpiry, printLog } from "../util/helpers";

const secureTokenService = async ({ cardDetails }: any) => {
  try {
    const url = `${BASE_URL}/secure_tokens`;

    const number = cardDetails?.cardNumber.replaceAll(" ", "");
    const { month, year } = getMonthYearFromExpiry(
      cardDetails?.cardExpiredDate || ""
    );
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${btoa(SECRET_KEY + ":")}`,
      },
      body: JSON.stringify({
        amount: "1000",
        currency: "JPY",
        return_url: "https://example.com/complete",
        payment_details: {
          type: "credit_card",
          number,
          month,
          year,
          verification_value: cardDetails?.cardCVV,
          name: cardDetails?.cardholderName,
        },
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

export const checkSecureTokenStatus = async (token: string) => {
  try {
    const url = `${BASE_URL}/secure_tokens/${token}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${btoa(SECRET_KEY + ":")}`,
      },
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

export default secureTokenService;
