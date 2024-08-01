import { PaymentType } from "./types";

export const noop = () => { };
export const BASE_URL = "https://komoju.com";
export const BASE_URL_API = `${BASE_URL}/api/v1`;
export const API_HEADER = (publicKey: string) => ({
  accept: "application/json",
  "content-type": "application/json",
  "KOMOJU-VIA": "mobile_react",
  Authorization: `Basic ${btoa(publicKey + ":")}`,
});

export const paymentSuccessCtaText = "BACK_TO_STORE";
export const paymentFailedCtaText = "UPDATE_PAYMENT_METHOD";

export const emailRegex = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;
export const cardTypeRegex = {
  amex: /^3[47]\d{0,13}/,
  diner: /^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,
  mastercard: /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,
  jcb15: /^(?:2131|1800)\d{0,11}/,
  jcb: /^(?:35)\d{0,17}/,
  visa: /^4\d{0,18}/,
};

export enum ThemeModes {
  light = "light",
  dark = "dark",
}

export enum SimpleRedirectTypeModes {
  paypay = "PAY_PAY",
  alipay = "ALI_PAY",
  linepay = "LINE_PAY",
  merpay = "MER_PAY",
  rakuten = "RAKUTEN",
  aupay = "AU_PAY"
}

export const LangKeys: { [key in PaymentType]: string } = {
  [PaymentType.ALI_PAY]: "ALI_PAY",
  [PaymentType.AU_PAY]: "AU_PAY",
  [PaymentType.BANK_TRANSFER]: "BANK_TRANSFER",
  [PaymentType.BIT_CASH]: "BIT_CASH",
  [PaymentType.CREDIT]: "CREDIT",
  [PaymentType.KONBINI]: "KONBINI",
  [PaymentType.LINE_PAY]: "LINE_PAY",
  [PaymentType.MER_PAY]: "MER_PAY",
  [PaymentType.PAIDY]: "PAIDY",
  [PaymentType.PAY_EASY]: "PAY_EASY",
  [PaymentType.PAY_PAY]: "PAY_PAY",
  [PaymentType.RAKUTEN]: "RAKUTEN",
  [PaymentType.WEB_MONEY]: "WEB_MONEY",
  [PaymentType.NET_CASH]: "NET_CASH",

};
