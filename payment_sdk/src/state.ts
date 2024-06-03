import { createContext } from "react";

import { noop } from "./util/constants";

import {
  ActionType,
  InitPrams,
  PaymentType,
  State,
  initialState,
} from "./util/types";

export const Actions = {
  SET_CARD_NUMBER: "SET_CARD_NUMBER",
  SET_PAYMENT_OPTION: "SET_PAYMENT_OPTION",
  SET_CARD_EXPIRED_DATE: "SET_CARD_EXPIRED_DATE",
  SET_CARD_CVV: "SET_CARD_CVV",
};

// Define the reducer function
export function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case Actions.SET_PAYMENT_OPTION:
      return {
        ...state,
        paymentType: action.type as PaymentType,
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
    default:
      throw new Error();
  }
}
const defaultValue = {
  createPayment: noop,
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
