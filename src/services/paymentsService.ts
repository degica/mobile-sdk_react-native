import { API_HEADER, BASE_URL_API } from "../util/constants";
import { printLog } from "../util/helpers";
import { paymentsResponseType } from "../util/types";

type GenerateTokenProps = {
  publishableKey: string;
  amount: string;
  currency: string;
  token: string;
};

const createPayment = async ({
  publishableKey,
  amount,
  currency,
  token,
}: GenerateTokenProps): Promise<paymentsResponseType | null> => {
  try {
    const url = `${BASE_URL_API}/payments`;

    const options = {
      method: "POST",
      headers: API_HEADER(publishableKey),
      body: JSON.stringify({
        amount: amount,
        currency,
        payment_details: token,
        tax: 0, // TODO get confirmation on hard coding tax amount
      }),
    };

    const response = await fetch(url, options);
    // converting the above response to jason format
    const data = await response.json();

    return data;
  } catch (e) {
    printLog({
      logName: "Error:",
      message: "Token generation failed",
    });
    return null;
  }
};

export default createPayment;
