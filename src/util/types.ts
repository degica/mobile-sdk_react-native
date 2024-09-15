import { Dispatch, ReactNode, SetStateAction } from "react";

export type InitPrams = {
  publishableKey: string;
  paymentMethods?: Array<PaymentType>;
  language?: LanguageTypes;
  useBottomSheet?: boolean;
  theme?: Partial<UserFriendlyTheme>;
  urlScheme?: string;
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
  LINE_PAY = "linepay",
  MER_PAY = "merpay",
  BANK_TRANSFER = "bank_transfer",
  PAY_EASY = "pay_easy",
  WEB_MONEY = "web_money",
  BIT_CASH = "bit_cash",
  NET_CASH = "net_cash",
  PAIDY = "paidy",
  RAKUTEN = "rakutenpay",
  AU_PAY = "aupay",
  ALI_PAY = "alipay",
}

export enum KonbiniType {
  SEVEN_ELEVEN = "seven-eleven",
  LAWSON = "lawson",
  FAMILY_MART = "family-mart",
  MINI_stop = "ministop",
  DAILY_YAMAZAKI = "daily-yamazaki",
  SEICOMART = "seicomart",
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
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export enum TokenResponseStatuses {
  SUCCESS = "OK",
  CAPTURED = "captured",
  PENDING = "NEEDS_VERIFY",
  SKIPPED = "SKIPPED",
  ERROR = "ERRORED",
}

export enum ResponseScreenStatuses {
  /** When a payment is fully complete Displaying success screen immediately and disabling the cancel payment popup */
  SUCCESS = "success",
  /** Displaying failed screen immediately */
  FAILED = "failed",
  /** For displaying payment instruction screens and disabling the cancel payment popup */
  COMPLETE = "complete",
  /** For displaying payment instruction screens for cancelled by the user */
  CANCELLED = "cancelled",
  /** For displaying payment instruction screens for expired user session */
  EXPIRED = "expired",
}

export enum CurrencySign {
  JPY = "¥",
  USD = "$",
}

export enum CurrencyTypes {
  JPY = "JPY",
  USD = "USD",
}

export enum PaymentMode {
  Payment = "payment",
  Customer = "customer",
  CustomerPayment = "customer_payment",
}

export type payForSessionProps = {
  publishableKey: string;
  sessionId: string;
  paymentType: PaymentType;
  paymentDetails?: CardDetailsType &
    KonbiniDetailsType &
    TransferFormFieldsType &
    paymentTypeInputs;
};

type paymentTypeInputs = {
  singleInput?: string;
};

export type CardDetailsType = {
  cardholderName?: string;
  cardNumber?: string;
  cardExpiredDate?: string;
  cardCVV?: string;
  tokenId?: string;
};

type KonbiniDetailsType = {
  selectedStore?: string;
  name?: string;
  email?: string;
};

export type TransferFormFieldsType = {
  lastName?: string;
  firstName?: string;
  lastNamePhonetic?: string;
  firstNamePhonetic?: string;
  email?: string;
  phone?: string;
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
    status?: string;
  };
  customer?: {
    resource: PaymentMode;
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
  mode: PaymentMode;
  currency: CurrencyTypes;
  session_url?: string;
  return_url?: string;
  payment_methods: Array<sessionShowPaymentMethodType>;
  default_locale: string;
  created_at: string;
  cancelled_at: string;
  completed_at: string;
  error?: boolean;
  payment?: {
    payment_details: {
      instructions_url?: string;
    };
    status?: string;
  };
};

export type TokenResponseType = {
  id: string;
  verification_status: TokenResponseStatuses;
  authentication_url: string;
};

export type paymentsResponseType = {
  status: string;
};

export type setInputErrorType = {
  setInputErrors: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
};

export type cardValidationFuncProps = CardDetailsType & setInputErrorType;

export type konbiniValidationFuncProps = KonbiniDetailsType & setInputErrorType;

export type Nullable<T> = T | null;

export type brandsType = {
  [key: string]: {
    icon: string;
  };
};

export type brandType = {
  type: KonbiniType;
  icon: string;
};

export type sessionDataType = {
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
   * session mode of payment
   */
  mode: PaymentMode;
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
     * All user provided current payment session related data
     */
    sessionData:
      | CreatePaymentFuncType
      | sessionDataType
      | (CreatePaymentFuncType & sessionDataType);
    /**
     * All user provided props under KomojuProvider
     */
    providerPropsData: InitPrams;
    /**
     * State of the current payment.
     * this state is used to toggle(show hide) the success and failed screens.
     */
    paymentState:
      | ResponseScreenStatuses.SUCCESS
      | ResponseScreenStatuses.COMPLETE
      | ResponseScreenStatuses.FAILED
      | ResponseScreenStatuses.CANCELLED
      | ResponseScreenStatuses.EXPIRED
      | "";
    /**
     * States of the Bank transfer and Pay Easy fields.
     */
    transferFormFields?: TransferFormFieldsType;
    /**
     * Secure token id for 3ds payment
     */
    tokenId: string;
  };

export type sessionPayProps = {
  paymentType: PaymentType;
  paymentDetails?: CardDetailsType &
    KonbiniDetailsType &
    TransferFormFieldsType &
    paymentTypeInputs;
};

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

  /** Bank transfer and Pay Easy related states start */
  transferFormFields: {
    lastName: "",
    firstName: "",
    lastNamePhonetic: "",
    firstNamePhonetic: "",
    email: "",
    phone: "",
  },
  /** Bank transfer and Pay Easy related states end */

  paymentState: "",
  tokenId: "",
  sessionData: {
    sessionId: "",
    amount: "",
    currency: CurrencyTypes.JPY,
    paymentMethods: [],
  },
  providerPropsData: {
    publishableKey: "",
  },
};
// TODO: Fix this type error

export type ActionType = { type: string; payload: State[keyof State] };

export interface ThemeSchemeType {
  PRIMARY_COLOR: string;
  BACKGROUND_COLOR: string;
  ERROR: string;
  TEXT_COLOR: string;
  INPUT_BACKGROUND: string;
  INPUT_TEXT: string;
  INPUT_PLACEHOLDER: string;
  INVERTED_CONTENT: string;
  WHITE50: string;
  CARD_BACKGROUND: string;
  CARD_BORDER: string;
  LIGHT_BOX: string;
  CARD_SHADOW_IOS_COLOR: string;
  CARD_SHADOW_ANDROID_COLOR: string;
}

// Define a user-friendly theme interface
export interface UserFriendlyTheme {
  primaryColor: string;
  backgroundColor: string;
  errorColor: string;
  textColor: string;
  inputBackground: string;
  inputText: string;
  inputPlaceholder: string;
  invertedContent: string;
  transparentWhite: string;
  cardBackground: string;
  cardBorder: string;
  lightBox: string;
  cardShadowIOS: string;
  cardShadowAndroid: string;
}

export type KomojuProviderIprops = {
  children?: ReactNode | ReactNode[];
} & InitPrams;
