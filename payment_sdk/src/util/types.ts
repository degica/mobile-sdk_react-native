export type InitPrams = {
  urlScheme: string;
  publicKey: string;
};

export type CreatePaymentFuncType = {
  sessionId: string;
  secretKey?: string;
  onComplete?: (response: any) => void; // callback when transaction is complete status is passed as a prop
  onDismiss?: (response: any) => void; // callback when user closes the SDK modal
  enablePayWithoutSession?: boolean;
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

export enum TokenResponseStatuses {
  SUCCESS = "OK",
  CAPTURED = "captured",
  PENDING = "NEEDS_VERIFY",
  ERROR = "ERRORED",
}

export enum ResponseScreenStatuses {
  SUCCESS = "success",
  FAILED = "failed",
}

export enum CurrencySign {
  JPY = "¥",
  USD = "$",
}

export enum CurrencyTypes {
  JPY = "JPY",
  USD = "USD",
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

export type newNavStateProps = {
  url?: string;
  title?: string;
  loading?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
};

export type cardValidationFuncProps = {
  cardholderName: string;
  cardNumber: string;
  cardExpiredDate: string;
  cardCVV: string;
  setInputErrors: (data: object) => {};
};

export type Nullable<T> = T | null;

type webViewDataProps = {
  link: string;
  onNavChange: (data: newNavStateProps) => void;
};

export type State = CardDetailsType & {
  paymentType: PaymentType;
  loading: boolean;
  sessionPay: Function;
  webViewData: webViewDataProps;
  amount: string;
  currency: CurrencyTypes;
  paymentState:
    | ResponseScreenStatuses.SUCCESS
    | ResponseScreenStatuses.FAILED
    | "";
};

export type sessionPayProps = {
  paymentType: PaymentType;
  cardDetails?: CardDetailsType;
};

export const webViewDataInitialState = { link: "", onNavChange: ({}) => {} };

// Define the initial state
export const initialState: State = {
  paymentType: PaymentType.CREDIT,
  loading: false,
  cardholderName: "",
  cardCVV: "",
  cardNumber: "",
  cardExpiredDate: "",
  sessionPay: () => {},
  webViewData: webViewDataInitialState,
  amount: "",
  currency: CurrencyTypes.JPY,
  paymentState: "",
};
export type ActionType = { type: string; payload: any };
