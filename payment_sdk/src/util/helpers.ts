import { CurrencySign, CurrencyTypes } from "./types";

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

export const formatCurrency = ({
  amount,
  currency,
}: {
  amount: string;
  currency: CurrencyTypes;
}) => {
  const sign = CurrencySign[currency];

  if (currency !== CurrencyTypes.JPY)
    amount = (Number(amount) * 0.01).toString();

  return `${sign}${amount}`;
};
