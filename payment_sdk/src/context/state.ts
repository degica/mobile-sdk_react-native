import { createContext } from "react";

import { noop } from "@util/constants";
import {
  ActionType,
  CreatePaymentFuncType,
  InitPrams,
  PaymentType,
  State,
  initialState,
} from "@util/types";

/**
 * Action types for the reducer
 */

export const Actions = {
  RESET_STATES: "RESET_STATES",
  SET_CARDHOLDER_NAME: "SET_CARDHOLDER_NAME",
  SET_CARD_NUMBER: "SET_CARD_NUMBER",
  SET_PAYMENT_OPTION: "SET_PAYMENT_OPTION",
  SET_CARD_EXPIRED_DATE: "SET_CARD_EXPIRED_DATE",
  SET_CARD_CVV: "SET_CARD_CVV",
  SET_NAME: "SET_NAME",
  SET_EMAIL: "SET_EMAIL",
  SET_WEBVIEW_LINK: "SET_WEBVIEW_LINK",
  SET_LOADING: "SET_LOADING",
  SET_CURRENCY: "SET_CURRENCY",
  SET_AMOUNT: "SET_AMOUNT",
  SET_SELECTED_STORE: "SET_SELECTED_STORE",
  SET_PAYMENT_STATE: "SET_PAYMENT_STATE",
  SET_PAYMENT_METHODS: "SET_PAYMENT_METHODS",
  SESSION_PAY: "SESSION_PAY",
};

/**
 * Reducer function to manage the state of the payment system.
 * @param {State} state - The current state.
 * @param {ActionType} action - The action to be processed.
 * @returns {State} The new state after applying the action.
 */

export function reducer(state: State, action: ActionType) {
  switch (action.type) {
    case Actions.SET_PAYMENT_OPTION:
      return {
        ...state,
        paymentType: action.payload as PaymentType,
      };
    case Actions.RESET_STATES:
      return {
        ...state,
        ...action.payload,
      };
    case Actions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
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
    case Actions.SET_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case Actions.SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    case Actions.SET_WEBVIEW_LINK:
      return {
        ...state,
        webViewData: action.payload,
      };
    case Actions.SESSION_PAY:
      return {
        ...state,
        sessionPay: action.payload,
      };
    case Actions.SET_AMOUNT:
      return {
        ...state,
        amount: action.payload,
      };
    case Actions.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };
    case Actions.SET_SELECTED_STORE:
      return {
        ...state,
        selectedStore: action.payload,
      };
    case Actions.SET_PAYMENT_STATE:
      return {
        ...state,
        paymentState: action.payload,
      };
    case Actions.SET_PAYMENT_METHODS:
      return {
        ...state,
        paymentMethods: action.payload,
      };
    default:
      throw new Error();
  }
}
const defaultValue = {
  /**
   * Function to create a payment session.
   * @param {CreatePaymentFuncType} data - The data for creating a payment session.
   */
  // TODO: Fix this type error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createPayment: (data: CreatePaymentFuncType) => {},
  /**
   * Function to display the payment sheet UI.
   */
  showPaymentSheetUI: noop,
  /**
   * Function to initialize Komoju without relying on props.
   * @param {InitPrams} data - The initialization parameters.
   */
  // TODO: Fix this type error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initializeKomoju: (data: InitPrams) => {},
};
/**
 * State context for the Komoju payment system.
 * @type {React.Context<State>}
 */

export const StateContext = createContext(initialState);
/**
 * Dispatch context for the Komoju payment system.
 * @type {React.Context<(action: ActionType) => ActionType>}
 */
export const DispatchContext = createContext(
  ({ type, payload }: ActionType) => ({
    type,
    payload,
  })
);

/**
 * Komoju context providing default functions for payment operations.
 * @type {React.Context<typeof defaultValue>}
 */
export const KomojuContext = createContext(defaultValue);
