import { BASE_URL_API, API_HEADER } from "../util/constants";
import { printLog } from "../util/helpers";
import { TokenResponseType, PaymentType } from "../util/types";

type GenerateTokenProps = {
  publishableKey: string;
  amount: string;
  currency: string;
  return_url: string;
  cardNumber: string;
  month: string;
  year: string;
  cardCVV: string;
  cardholderName: string;
};

const generateToken = async ({
  publishableKey,
  amount,
  currency,
  return_url,
  cardNumber,
  month,
  year,
  cardCVV,
  cardholderName,
}: GenerateTokenProps): Promise<TokenResponseType | null> => {
  try {
    const url = `${BASE_URL_API}/secure_tokens`;

    const payment_details = {
      type: PaymentType.CREDIT,
      number: cardNumber,
      month,
      year,
      verification_value: cardCVV,
      name: cardholderName,
    };

    const options = {
      method: "POST",
      headers: API_HEADER(publishableKey),
      body: JSON.stringify({
        amount,
        currency,
        return_url,
        cancel_url: return_url,
        payment_details,
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

const getTokenResult = async ({
  publishableKey,
  tokenId,
}: {
  publishableKey: string;
  tokenId: string;
}): Promise<TokenResponseType | null> => {
  try {
    const url = `${BASE_URL_API}/secure_tokens/${tokenId}`;

    const options = {
      method: "GET",
      headers: API_HEADER(publishableKey),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    return data;
  } catch (e) {
    printLog({
      logName: "Error:",
      message: "Get token results filed",
    });
    return null;
  }
};

export { generateToken, getTokenResult };
