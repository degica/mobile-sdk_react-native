import { BASE_URL } from "../util/constants";
import { printLog } from "../util/helpers";

import { SECRET_KEY } from "@env";

type paymentServiceProps = {
  token: string;
  amount?: string;
  tax?: string;
  currency?: string;
};

const paymentService = async ({
  token,
  amount,
  tax,
  currency,
}: paymentServiceProps) => {
  try {
    const url = `${BASE_URL}/payments`;

    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: `Basic ${btoa(SECRET_KEY + ":")}`,
      },
      body: JSON.stringify({
        capture: true,
        amount: "1000",
        tax: "0",
        currency: "JPY",
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
