import { Dimensions, Platform } from "react-native";
import {
  brandsType,
  CardTypes,
  CurrencySign,
  CurrencyTypes,
  PaymentType,
  sessionShowPaymentMethodType,
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
  let expiryDate: any = prevExpiry;
  if (/^[2-9]$/.test(expiryDate)) {
    expiryDate = `0${expiryDate}`;
  }

  if (prevExpiry.length === 2 && +prevExpiry > 12) {
    const [head, ...tail] = prevExpiry;
    expiryDate = `0${head}/${tail.join("")}`;
  }

  if (/^1[/-]$/.test(expiryDate)) {
    return `01 / `;
  }

  expiryDate = expiryDate.match(/(\d{1,2})/g) || [];
  if (expiryDate.length === 1) {
    if (prevExpiry.includes("/")) {
      return expiryDate[0];
    }
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
) => {
  // Initialize an empty array to store the converted objects
  let result = [];

  // Iterate over the keys of the input object
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
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
export const determineCardType = (cardNumber: string): string | null => {
  const firstDigit = cardNumber[0];
  const firstTwoDigits = parseInt(cardNumber.substring(0, 2));
  const firstThreeDigits = parseInt(cardNumber.substring(0, 3));
  const firstFourDigits = parseInt(cardNumber.substring(0, 4));
  const firstSixDigits = parseInt(cardNumber.substring(0, 6));

  /** Check if the card number is a visa card */
  if (firstDigit === "4") {
    return CardTypes.VISA;
  }
  /** Check if the card number is a master card */
  if (
    (firstTwoDigits >= 51 && firstTwoDigits <= 55) ||
    (firstFourDigits >= 2221 && firstFourDigits <= 2720)
  ) {
    return CardTypes.MASTER;
  }
  /** Check if the card number is a American express card */
  if (firstTwoDigits === 34 || firstTwoDigits === 37) {
    return CardTypes.AMEX;
  }
  /** Check if the card number is a JCB card */
  if (firstFourDigits >= 3528 && firstFourDigits <= 3589) {
    return CardTypes.JCB;
  }
  /** Check if the card number is a Dinners Club card */
  if (firstTwoDigits === 36) {
    return CardTypes.DINERS_CLUB;
  }
  /** Check if the card number is a Discover card */
  if (
    firstTwoDigits === 65 ||
    firstFourDigits === 6011 ||
    (firstThreeDigits >= 644 && firstThreeDigits <= 649) ||
    (firstSixDigits >= 622126 && firstSixDigits <= 622925)
  ) {
    return CardTypes.DISCOVER;
  }

  // Return null if the card type is not on both visa and master
  return null;
};

export const isAndroid = () => Platform.OS === "android";
export const isIOS = () => Platform.OS === "ios";
export const { height: SCREEN_HEIGHT } = Dimensions.get("window");
