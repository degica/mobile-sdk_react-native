export type InitPrams = {
  publicKey: string;
  payment_methods?: Array<PaymentType>;
  language?: LanguageTypes;
};

export type CreatePaymentFuncType = {
  /**
   * session Id created by user using https://doc.komoju.com/reference/post_sessions will be passed here.
   */
  sessionId: string;
  /**
   * Callback when transaction is complete.
   * @param {CreatePaymentFuncType} response - Status is passed as a prop.
   */
  onComplete?: (response: SessionShowResponseType) => void;
  /**
   * Callback when user closes the SDK modal
   * @param {CreatePaymentFuncType} response - Status is passed as a prop.
   */
  onDismiss?: (response: SessionShowResponseType) => void;
};

export type KomojuContext = {
  createPayment: () => void; // add the types for here
  showPaymentSheetUI: () => void;
  initializeKomoju: (args: InitPrams) => void;
};

export enum LanguageTypes {
  ENGLISH = "en",
  JAPANESE = "ja",
}

export enum PaymentType {
  KONBINI = "konbini",
  CREDIT = "credit_card",
  PAY_PAY = "paypay",
}

export enum CardTypes {
  VISA = "visa",
  AMEX = "american_express",
  MASTER = "master",
  JCB = "jcb",
  DINERS_CLUB = "diners_club",
  DISCOVER = "discover",
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
  /** When a payment is fully complete Displaying success screen immediately and disabling the cancel payment popup */
  SUCCESS = "success",
  /** Displaying failed screen immediately */
  FAILED = "failed",
  /** For displaying payment instruction screens and disabling the cancel payment popup */
  COMPLETE = "complete",
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
  paymentDetails?: CardDetailsType & KonbiniDetailsType;
};

type CardDetailsType = {
  cardholderName?: string;
  cardNumber?: string;
  cardExpiredDate?: string;
  cardCVV?: string;
};

type KonbiniDetailsType = {
  selectedStore?: string;
  name?: string;
  email?: string;
};

export type newNavStateProps = {
  url?: string;
  title?: string;
  loading?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
};

export type SessionPayResponseType = {
  redirect_url: string;
  status: string;
  payment: {
    payment_details: { instructions_url: string };
  };
};

export type sessionShowPaymentMethodType = {
  type: PaymentType;
  brands?: Array<string> | { [key: string]: brandsType };
  exchange_rate?: number;
};

export type SessionShowResponseType = {
  id: string;
  status: string;
  expired: boolean;
  secure_token?: { verification_status?: string };
  amount: number;
  mode: string;
  currency: string;
  session_url?: string;
  return_url?: string;
  payment_methods: Array<sessionShowPaymentMethodType>;
  default_locale: string;
  created_at: string;
  cancelled_at: string;
  completed_at: string;
  error?: boolean;
};

type setInputErrorType = {
  // TODO: Fix this type error
  // eslint-disable-next-line @typescript-eslint/ban-types
  setInputErrors: (data: object) => {};
};

export type cardValidationFuncProps = CardDetailsType & setInputErrorType;

export type konbiniValidationFuncProps = KonbiniDetailsType & setInputErrorType;

export type Nullable<T> = T | null;

type webViewDataProps = {
  link: string;
  onNavChange: (data: newNavStateProps) => void;
};

export type brandsType = {
  [key: string]: {
    icon: string;
  };
};

export type brandType = {
  type: string;
  icon: string;
};

export type State = CardDetailsType &
  KonbiniDetailsType & {
    /**
     * Current selected payment type.
     */
    paymentType: PaymentType;
    /**
     * Global loading state. to display loading animation over sdk and disable buttons.
     */
    loading: boolean;
    /**
     * Callback function to call relevant api for each payment type.
     */
    // TODO: Fix this type error
  // eslint-disable-next-line @typescript-eslint/ban-types
    sessionPay: Function;
    /**
     * Web view url and callback when url change at web view.
     * when field is also used to toggle(show hide) the web view.
     */
    webViewData: webViewDataProps;
    /**
     * Amount for the payment
     */
    amount: string;
    /**
     * Currency type for the payment
     */
    currency: CurrencyTypes;
    /**
     * All payment methods which are accepting
     */
    paymentMethods: Array<sessionShowPaymentMethodType>;
    /**
     * State of the current payment.
     * this state is used to toggle(show hide) the success and failed screens.
     */
    paymentState:
    | ResponseScreenStatuses.SUCCESS
    | ResponseScreenStatuses.FAILED
    | "";
  };

export type sessionPayProps = {
  paymentType: PaymentType;
  paymentDetails?: CardDetailsType;
};

// TODO: Fix this type error
// eslint-disable-next-line no-empty-pattern
export const webViewDataInitialState = { link: "", onNavChange: ({ }) => { } };

// Define the initial state
export const initialState: State = {
  paymentType: PaymentType.CREDIT,
  loading: false,

  /** credit card payment related states start */
  cardholderName: "",
  cardCVV: "",
  cardNumber: "",
  cardExpiredDate: "",
  /** credit card payment related states end */

  /** konbini pay related states start */
  /** konbini pay default selected to 7-eleven store */
  selectedStore: "seven-eleven",
  name: "",
  email: "",
  /** konbini pay related states start */

  sessionPay: () => { },
  webViewData: webViewDataInitialState,
  amount: "",
  currency: CurrencyTypes.JPY,
  paymentState: "",
  paymentMethods: [],
};
// TODO: Fix this type error
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionType = { type: string; payload: any };
