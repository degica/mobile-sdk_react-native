import { BASE_URL } from "../util/constants";
import { getMonthYearFromExpiry, printLog } from "../util/helpers";

const secureTokenService = async ({ paymentDetails, secretKey }: any) => {
  try {
    const url = `${BASE_URL}/secure_tokens`;

    const number = paymentDetails?.cardNumber.replaceAll(" ", "");
    const { month, year } = getMonthYearFromExpiry(
      paymentDetails?.cardExpiredDate || ""
    );
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${btoa(secretKey + ":")}`,
      },
      body: JSON.stringify({
        amount: "2000",
        currency: "JPY",
        return_url: "https://example.com/complete",
        payment_details: {
          type: "credit_card",
          number,
          month,
          year,
          verification_value: paymentDetails?.cardCVV,
          name: paymentDetails?.cardholderName,
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

export const checkSecureTokenStatus = async ({
  token,
  secretKey,
}: {
  token: string;
  secretKey: string;
}) => {
  try {
    const url = `${BASE_URL}/secure_tokens/${token}`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${btoa(secretKey + ":")}`,
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
