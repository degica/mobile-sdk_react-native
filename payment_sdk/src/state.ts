import { createContext } from "react";

import { noop } from "./util/constants";

import {
  ActionType,
  CreatePaymentFuncType,
  InitPrams,
  PaymentType,
  State,
  initialState,
} from "./util/types";

export const Actions = {
  SET_CARDHOLDER_NAME: "SET_CARDHOLDER_NAME",
  SET_CARD_NUMBER: "SET_CARD_NUMBER",
  SET_PAYMENT_OPTION: "SET_PAYMENT_OPTION",
  SET_CARD_EXPIRED_DATE: "SET_CARD_EXPIRED_DATE",
  SET_CARD_CVV: "SET_CARD_CVV",
  SET_WEBVIEW_LINK: "SET_WEBVIEW_LINK",
  SESSION_PAY: "SESSION_PAY",
};

// Define the reducer function
export function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case Actions.SET_PAYMENT_OPTION:
      return {
        ...state,
        paymentType: action.type as PaymentType,
      };
    case Actions.SET_CARDHOLDER_NAME:
      return {
        ...state,
        cardholderName: action.payload,
      };
    case Actions.SET_CARD_NUMBER:
      return {
        ...state,
        cardNumber: action.payload,
      };
    case Actions.SET_CARD_EXPIRED_DATE:
      return {
        ...state,
        cardExpiredDate: action.payload,
      };
    case Actions.SET_CARD_CVV:
      return {
        ...state,
        cardCVV: action.payload,
      };
    case Actions.SET_WEBVIEW_LINK:
      return {
        ...state,
        webViewLink: action.payload,
      };
    case Actions.SESSION_PAY:
      return {
        ...state,
        sessionPay: action.payload,
      };
    default:
      throw new Error();
  }
}
const defaultValue = {
  createPayment: (data: CreatePaymentFuncType) => {},
  showPaymentSheetUI: noop,
  initializeKomoju: (data: InitPrams) => {},
};

export const StateContext = createContext(initialState);
export const DispatchContext = createContext(
  ({ type, payload }: ActionType) => ({
    type,
    payload,
  })
);
export const KomojuContext = createContext(defaultValue);
