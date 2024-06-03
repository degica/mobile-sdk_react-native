export type InitPrams = {
  urlScheme: string;
  pubickKey: string;
};

export type createPaymentFuncType = (
  sessionId: string,
  onError: () => {}, // define the callback types here
  onSuccess?: () => {} // define the callback types here
) => {};

export type KomojuContext = {
  createPayment: () => void; // add the types for here
  showPaymentSheetUI: () => void;
  initializeKomoju: (args: InitPrams) => void;
};

export enum PaymentType {
  KOBINI = "KONBINI",
  CREDIT = "CREDIT",
  PAY_PAY = "PAY_PAY",
}

export type Nullable<T> = T | null;

export type State = {
  paymentType: PaymentType;
  cardNumber: string;
  cardExpiredDate: string;
  cardCVV: string;
};

// Define the initial state
export const initialState: State = {
  paymentType: PaymentType.CREDIT,
  cardCVV: "",
  cardNumber: "",
  cardExpiredDate: "",
};
export type ActionType = { type: string; payload: any };
