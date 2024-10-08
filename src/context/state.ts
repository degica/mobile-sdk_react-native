import { createContext } from "react";

import { noop } from "../util/constants";
import {
  ActionType,
  CreatePaymentFuncType,
  InitPrams,
  PaymentType,
  State,
  initialState,
} from "../util/types";

/**
 * Action types for the reducer
 */

export const Actions = {
  RESET_STATES: "RESET_STATES",
  SET_CARD_DATA: "SET_CARD_DATA",
  SET_PAYMENT_OPTION: "SET_PAYMENT_OPTION",
  SET_NAME: "SET_NAME",
  SET_EMAIL: "SET_EMAIL",
  SET_TRANSFER_FORM_FIELDS: "SET_TRANSFER_FORM_FIELDS",
  SET_SINGLE_INPUT_FORM_FIELD: "SET_SINGLE_INPUT_FORM_FIELD",
  SET_LOADING: "SET_LOADING",
  SET_CURRENCY: "SET_CURRENCY",
  SET_AMOUNT: "SET_AMOUNT",
  SET_SELECTED_STORE: "SET_SELECTED_STORE",
  SET_PAYMENT_STATE: "SET_PAYMENT_STATE",
  SET_PAYMENT_METHODS: "SET_PAYMENT_METHODS",
  SET_SESSION_DATA: "SET_SESSION_DATA",
  SET_PROVIDER_PROPS_DATA: "SET_PROVIDER_PROPS_DATA",
  SET_TOKEN_ID: "SET_TOKEN_ID",
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
        ...(action.payload as object),
      };
    case Actions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case Actions.SET_CARD_DATA:
      return {
        ...state,
        cardData: { ...state.cardData, ...(action.payload as object) },
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
    case Actions.SET_TRANSFER_FORM_FIELDS:
      return {
        ...state,
        transferFormFields: action.payload,
      };
    case Actions.SET_SESSION_DATA:
      return {
        ...state,
        sessionData: { ...state.sessionData, ...(action.payload as object) },
      };
    case Actions.SET_PROVIDER_PROPS_DATA:
      return {
        ...state,
        providerPropsData: action.payload,
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
    case Actions.SET_TOKEN_ID:
      return {
        ...state,
        tokenId: action.payload,
      };
    default:
      throw new Error();
  }
}
const defaultValue = {
  /**
   * Function to create a payment session.
   * @param {CreatePaymentFuncType} _data - The data for creating a payment session.
   */
  // TODO: Fix this type error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  createPayment: (_data: CreatePaymentFuncType) => {},
  /**
   * Function to display the payment sheet UI.
   */
  showPaymentSheetUI: noop,
  /**
   * Function to initialize Komoju without relying on props.
   * @param {InitPrams} _data - The initialization parameters.
   */
  // TODO: Fix this type error
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initializeKomoju: (_data: InitPrams) => {},
  /**
   * Function to close the payment sheet manually.
   */
  closePaymentSheet: noop,
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
