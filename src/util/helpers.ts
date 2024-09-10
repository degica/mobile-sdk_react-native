import { Alert, Dimensions, Linking, Platform } from "react-native";

import { cardTypeRegex, themeMapping } from "./constants";
import {
  brandsType,
  CardTypes,
  CurrencySign,
  CurrencyTypes,
  KonbiniType,
  PaymentType,
  sessionShowPaymentMethodType,
  ThemeSchemeType,
  UserFriendlyTheme,
} from "./types";

export const isDevApp = __DEV__;

export const printLog = ({
  logName,
  message,
}: {
  logName: string;
  message: string;
}) => {
  if (isDevApp) console.log(logName, message);
};

export const formatExpiry = (expiry: string) => {
  const prevExpiry = expiry.split(" / ").join("/");

  if (!prevExpiry) return null;
  // TODO: Fix this type error

  let expiryDate: string | string[] = prevExpiry;
  if (/^[2-9]$/.test(expiryDate)) {
    expiryDate = `0${expiryDate}`;
  }

  if (prevExpiry.length === 2 && +prevExpiry > 12) {
    const [head, ...tail] = prevExpiry;
    expiryDate = `0${head}/${tail.join("")}`;
  }

  if (/^1[/-]$/.test(expiryDate)) {
    return "01 / ";
  }

  expiryDate = expiryDate.match(/(\d{1,2})/g) || [];
  if (expiryDate.length === 1) {
    if (prevExpiry.includes("/")) {
      return expiryDate[0];
    }
    if (typeof expiryDate === "string")
      if (/\d{2}/.test(expiryDate)) {
        return `${expiryDate[0]} / `;
      }
  }
  if (expiryDate.length > 2) {
    const [, month, year] =
      expiryDate.join("").match(/^(\d{2}).*(\d{2})$/) || [];
    return [month, year].join(" / ");
  }
  return expiryDate.join(" / ");
};

export const getMonthYearFromExpiry = (expiry: string) => {
  const splitValues = expiry.split(" / ");

  return { month: splitValues[0], year: splitValues[1] };
};

export const formatCreditCardNumber = (cardNumber: string) => {
  const formatCardNumberArray = [];
  const cardNumberArray = cardNumber.replaceAll(" ", "").split("");
  let startOffset = 0;
  let loopCounter = 4;
  const totalNumberOfIterations = Math.ceil(cardNumberArray.length / 4) * 4;

  while (totalNumberOfIterations >= loopCounter) {
    const subArray = cardNumberArray.slice(startOffset, loopCounter);
    formatCardNumberArray.push(subArray);
    startOffset += 4;
    loopCounter += 4;
  }
  return formatCardNumberArray.map((el) => el.join("")).join(" ");
};

function thousandSeparator(number: string) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatCurrency = ({
  amount,
  currency,
}: {
  amount: string;
  currency: CurrencyTypes;
}) => {
  const sign = CurrencySign[currency];

  // Convert the string to a number
  const number = parseFloat(amount);

  // Check if the conversion was successful
  if (isNaN(number)) {
    return `${sign}0.00`;
  }

  // converting the amount to 100 cents except for JPY
  if (currency !== CurrencyTypes.JPY)
    amount = (Number(amount) * 0.01).toFixed(2);

  return `${sign}${thousandSeparator(amount)}`;
};

// method to convert konbini payment list brands object to a array of brand type and icon
export const parseBrands = (
  obj: string[] | { [key: string]: brandsType } | undefined
): { type: KonbiniType; icon: string }[] => {
  // Initialize an empty array to store the converted objects
  const result: { type: KonbiniType; icon: string }[] = [];

  // Iterate over the keys of the input object
  for (const key in obj) {
    // TODO: Fix this type error

    if (obj.hasOwnProperty(key)) {
      // TODO: Fix this type error
      // @ts-expect-error - Type 'string' cannot be used to index type 'brandsType'.
      // Create a new object with 'type' as the key and 'icon' as the value
      result.push({ type: key, icon: obj[key].icon });
    }
  }

  return result;
};

// Method to filter out payment methods
export const parsePaymentMethods = (
  userPaymentMethods: PaymentType[] | undefined,
  sessionPaymentMethods: sessionShowPaymentMethodType[] | undefined
) => {
  // check if user has provided explicit payment methods
  if (userPaymentMethods && userPaymentMethods?.length > 0) {
    const parsedPayment: sessionShowPaymentMethodType[] = [];

    // map the payment methods from session for each payment method user provided
    userPaymentMethods.forEach((item: PaymentType) => {
      const paymentMethod = sessionPaymentMethods?.find(
        (method) => method.type === item
      );

      // if the payment method match form session add it to the list
      if (paymentMethod) parsedPayment.push(paymentMethod);
    });

    return parsedPayment;
  } else {
    // if user does not provide any payment methods use the payment methods from session
    return sessionPaymentMethods;
  }
};

// Determine the card type based on the card number
export const determineCardType = (
  cardNumber: string
): CardTypes | "unknown" | null => {
  if (cardTypeRegex.amex.exec(cardNumber)) {
    return CardTypes.AMEX;
  } else if (cardTypeRegex.diner.exec(cardNumber)) {
    return CardTypes.DINERS_CLUB;
  } else if (cardTypeRegex.mastercard.exec(cardNumber)) {
    return CardTypes.MASTER;
  } else if (cardTypeRegex.jcb15.exec(cardNumber)) {
    return CardTypes.JCB;
  } else if (cardTypeRegex.jcb.exec(cardNumber)) {
    return CardTypes.JCB;
  } else if (cardTypeRegex.visa.exec(cardNumber)) {
    return CardTypes.VISA;
  } else if (cardNumber.length > 2) {
    return "unknown";
  } else return null;
};

export const extractParameterFromUrl = (
  url: string,
  parameter: string
): string => {
  const queryString = url.split("?")[1]; // Get the part after '?'
  const paramsArray = queryString?.split("&") ?? []; // Split each parameter

  for (const param of paramsArray) {
    const [key, value] = param.split("=");
    if (key === parameter) {
      return value ?? "";
    }
  }

  return "";
};

export const openURL = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (err) {
    Alert.alert("Redirection not working. Please contact support!");
  }
};

export const isAndroid = () => Platform.OS === "android";
export const isIOS = () => Platform.OS === "ios";
export const { height: SCREEN_HEIGHT } = Dimensions.get("window");


// Function to convert UserFriendlyTheme to ThemeSchemeType
export function fromUserFriendlyTheme(userTheme: Partial<UserFriendlyTheme>): Partial<ThemeSchemeType> {
  return Object.entries(userTheme).reduce((acc, [userKey, value]) => {
    const internalKey = themeMapping[userKey as keyof UserFriendlyTheme];
    if (internalKey) {
      acc[internalKey] = value;
    }
    return acc;
  }, {} as Partial<ThemeSchemeType>);
}