import { emailRegex } from "./constants";
import {
  cardValidationFuncProps,
  konbiniValidationFuncProps,
  PaymentStatuses,
  SessionShowResponseType,
  setInputErrorType,
  TransferFormFieldsType,
} from "./types";

const MAX_CARD_LENGTH = 19;

export const isCardNumberValid = (cardString: string) => {
  const text = cardString.replaceAll(" ", "");
  try {
    if (text?.length <= 0) {
      return true;
    }
    if (text?.length > MAX_CARD_LENGTH) {
      return false;
    }
    const cardNumber = parseInt(text, 10);
    if (isNaN(cardNumber)) {
      return false;
    }
    const cardNumberString = `${cardNumber}`;
    if (text.length !== cardNumberString?.length) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
export const validateCardExpiry = (expiry: string) => {
  try {
    if (expiry?.length <= 0) {
      return true;
    }
    const derivedExpiry = expiry.replace(" / ", "");

    if (derivedExpiry.length > 4) {
      return false;
    }
    const expiryMonthValue = derivedExpiry.slice(0, 2);
    const expiryYearValue = derivedExpiry.slice(2, 4);
    const expiryMonth = parseInt(expiryMonthValue, 10);
    const expiryYear = parseInt(expiryYearValue, 10);
    const hasUserEnteredYear = expiryYearValue?.length === 2;
    if (expiryMonth > 12) {
      return false;
    }
    if (hasUserEnteredYear) {
      if (expiryYear > 99) {
        return false;
      }
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear() % 100;
      if (
        expiryYear < currentYear ||
        (expiryYear === currentYear && expiryMonth < currentMonth)
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
};

export const validateSessionResponse = (
  sessionData: SessionShowResponseType | null
) => {
  return (
    !sessionData ||
    sessionData?.error ||
    sessionData.expired ||
    sessionData?.status === PaymentStatuses.SUCCESS ||
    sessionData?.status === PaymentStatuses.ERROR
  );
};

export const validateCardFormFields = ({
  cardholderName,
  cardNumber,
  cardExpiredDate,
  cardCVV,
  setInputErrors,
}: cardValidationFuncProps): boolean => {
  let valid = true;

  if (!cardholderName) {
    setInputErrors((pre: object) => ({ ...pre, name: true }));
    valid = false;
  }
  if (!cardNumber) {
    setInputErrors((pre: object) => ({ ...pre, number: true }));
    valid = false;
  }
  if (!luhnCheck(cardNumber ?? "")) {
    setInputErrors((pre: object) => ({ ...pre, number: true }));
    valid = false;
  }
  if (!expiryDateCheck(cardExpiredDate ?? "")) {
    setInputErrors((pre: object) => ({ ...pre, expiry: true }));
    valid = false;
  }
  if (!cardCVV) {
    setInputErrors((pre: object) => ({ ...pre, cvv: true }));
    valid = false;
  }

  return valid;
};

const luhnCheck = (cardNumber: string) => {
  // accept only digits and spaces
  if (/[^0-9\s]+/.test(cardNumber)) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;
  cardNumber = cardNumber.replace(/\D/g, "");
  const length = cardNumber.length;

  // iterating backwards, double every second digit
  for (let i = length - 1; i >= 0; --i) {
    let digit = parseInt(cardNumber.charAt(i), 10);

    // double. if doubled digit is > 9, subtract 9
    if (shouldDouble && (digit *= 2) > 9) {
      digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const expiryDateCheck = (expiry: string) => {
  const derivedExpiry = expiry.replace(" / ", "");

  if (derivedExpiry.length !== 4) return false;
  else return true;
};

export const validateTransferFormFields = ({
  lastName,
  firstName,
  lastNamePhonetic,
  firstNamePhonetic,
  email,
  phone,
  setInputErrors,
}: TransferFormFieldsType & setInputErrorType): boolean => {
  let valid = true;

  if (!lastName) {
    setInputErrors((pre: object) => ({ ...pre, lastName: true }));
    valid = false;
  }
  if (!firstName) {
    setInputErrors((pre: object) => ({ ...pre, firstName: true }));
    valid = false;
  }
  if (!lastNamePhonetic) {
    setInputErrors((pre: object) => ({ ...pre, lastNamePhonetic: true }));
    valid = false;
  }
  if (!firstNamePhonetic) {
    setInputErrors((pre: object) => ({ ...pre, firstNamePhonetic: true }));
    valid = false;
  }
  if (!email || !validateEmail(email)) {
    setInputErrors((pre: object) => ({ ...pre, email: true }));
    valid = false;
  }
  if (!phone) {
    setInputErrors((pre: object) => ({ ...pre, phone: true }));
    valid = false;
  }

  return valid;
};

export const validateKonbiniFormFields = ({
  name,
  email,
  setInputErrors,
}: konbiniValidationFuncProps): boolean => {
  let valid = true;

  if (!name) {
    setInputErrors((pre: object) => ({ ...pre, name: true }));
    valid = false;
  }
  if (!email || !validateEmail(email)) {
    setInputErrors((pre: object) => ({ ...pre, email: true }));
    valid = false;
  }

  return valid;
};

export const validatePaidyFormFields = ({
  name,
  phone,
  setInputErrors,
}: { name: string; phone: string } & setInputErrorType): boolean => {
  let valid = true;

  if (!name) {
    setInputErrors((pre: object) => ({ ...pre, name: true }));
    valid = false;
  }
  if (!phone) {
    setInputErrors((pre: object) => ({ ...pre, phone: true }));
    valid = false;
  }

  return valid;
};

export const validateEmail = (email: string) => {
  return emailRegex.test(email);
};
