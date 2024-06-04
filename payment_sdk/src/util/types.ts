export type InitPrams = {
  urlScheme: string;
  publicKey: string;
};

export type CreatePaymentFuncType = {
  sessionId: string;
  onError?: () => void; // define the callback types here
  onSuccess?: () => void; // define the callback types here
};

export type KomojuContext = {
  createPayment: () => void; // add the types for here
  showPaymentSheetUI: () => void;
  initializeKomoju: (args: InitPrams) => void;
};

export enum PaymentType {
  KONBINI = "KONBINI",
  CREDIT = "CREDIT",
  PAY_PAY = "PAY_PAY",
}

export enum PaymentStatuses {
  ERROR = "error",
  SUCCESS = "completed",
  PENDING = "pending",
}

export type payForSessionProps = {
  publicKey: string;
  sessionId: string;
  paymentType: PaymentType;
  cardDetails?: CardDetailsType;
};

type CardDetailsType = {
  cardholderName: string;
  cardNumber: string;
  cardExpiredDate: string;
  cardCVV: string;
};

export type Nullable<T> = T | null;

export type State = CardDetailsType & {
  paymentType: PaymentType;
  loading: boolean;
  sessionPay: Function;
  webViewLink: string;
};

export type sessionPayProps = {
  paymentType: PaymentType;
  cardDetails?: CardDetailsType;
};

// Define the initial state
export const initialState: State = {
  paymentType: PaymentType.CREDIT,
  loading: false,
  cardholderName: "",
  cardCVV: "",
  cardNumber: "",
  cardExpiredDate: "",
  sessionPay: () => {},
  webViewLink: "",
};
export type ActionType = { type: string; payload: any };
