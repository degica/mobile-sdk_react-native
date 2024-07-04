export const noop = () => {};
export const BASE_URL = "https://komoju.com";
export const BASE_URL_API = `${BASE_URL}/api/v1`;

export const STATIC_CREDIT_CARD_SVG =
  "https://komoju-fields-demo.herokuapp.com/static/credit_card_number.svg";

export const STATIC_CREDIT_CARD_CVC_SVG =
  "https://komoju-fields-demo.herokuapp.com/static/credit_card_cvc.svg";

// redirect url parameter to identify if token validation is completed
export const tokenParameterName = "secure_token_id=";
// redirect url parameter to identify if session payment is completed
export const sessionParameterName = "sessions";

export const paymentSuccessCtaText = "Back to store";
export const paymentFailedCtaText = "Update payment method";

export const emailRegex = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;
export const cardTypeRegex = {
  amex: /^3[47]\d{0,13}/,
  diner: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
  mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
  jcb15: /^(?:2131|1800)\d{0,11}/,
  jcb: /^(?:35)\d{0,17}/,
  visa: /^4\d{0,18}/,
};
