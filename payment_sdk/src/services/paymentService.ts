import { BASE_URL_API } from "../util/constants";
import { printLog } from "../util/helpers";

type paymentServiceProps = {
  token: string;
  amount?: string;
  tax?: string;
  currency?: string;
  secretKey?: string;
};

const paymentService = async ({
  token,
  amount,
  tax = "0",
  currency,
  secretKey,
}: paymentServiceProps) => {
  try {
    const url = `${BASE_URL_API}/payments`;

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${btoa(secretKey + ":")}`,
      },
      body: JSON.stringify({
        capture: true,
        amount,
        tax,
        currency,
        payment_details: token,
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

export default paymentService;
