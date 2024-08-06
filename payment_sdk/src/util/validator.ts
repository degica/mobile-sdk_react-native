import { emailRegex } from "./constants";
import { CardPaymentScheme, KonbiniPaymentScheme, PaidyPaymentScheme, TransferPaymentScheme } from "./payment-scheme";
import {
  cardValidationFuncProps,
  InputErrors,
  konbiniValidationFuncProps,
  PaidyValidationFuncProps,
  PaymentStatuses,
  SessionShowResponseType,
  setInputErrorType,
  TransferFormFieldsType,
  ValidationFields,
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

const validateFields = (
  fields: ValidationFields,
  setInputErrors: React.Dispatch<React.SetStateAction<InputErrors>>
): boolean => {
  let isValid = true;

  Object.entries(fields).forEach(([fieldName, field]) => {
    const { value, required, validator } = field;
    let fieldValid = true;

    if (required && !value) {
      fieldValid = false;
    } else if (validator && !validator(value)) {
      fieldValid = false;
    }

    if (!fieldValid) {
      setInputErrors((prev) => ({ ...prev, [fieldName]: true }));
      isValid = false;
    }
  });

  return isValid;
};

export const validateEmail = (email: string) => {
  return emailRegex.test(email);
};

// validate the card form fields
export const validateCardFormFields = ({
  cardholderName,
  cardNumber,
  cardExpiredDate,
  cardCVV,
  setInputErrors,
}: cardValidationFuncProps): boolean => {
  return validateFields(
    {
      name: { ...CardPaymentScheme.name, value: cardholderName as string },
      number: { ...CardPaymentScheme.number, value: cardNumber as string },
      expiry: { ...CardPaymentScheme.expiry, value: cardExpiredDate as string },
      cvv: { ...CardPaymentScheme.cvv, value: cardCVV as string },
    },
    setInputErrors
  );
};


// validate the transfer form fields
export const validateTransferFormFields = ({
  lastName,
  firstName,
  lastNamePhonetic,
  firstNamePhonetic,
  email,
  phone,
  setInputErrors,
}: TransferFormFieldsType & setInputErrorType): boolean => {
  return validateFields(
    {
      lastName: { ...TransferPaymentScheme.lastName, value: lastName as string },
      firstName: { ...TransferPaymentScheme.firstName, value: firstName as string },
      lastNamePhonetic: { ...TransferPaymentScheme.lastNamePhonetic, value: lastNamePhonetic as string },
      firstNamePhonetic: { ...TransferPaymentScheme.firstNamePhonetic, value: firstNamePhonetic as string },
      email: { ...TransferPaymentScheme.email, value: email as string },
      phone: { ...TransferPaymentScheme.phone, value: phone as string },
    },
    setInputErrors
  );
};

// 
export const validateKonbiniFormFields = ({
  name,
  email,
  setInputErrors,
}: konbiniValidationFuncProps): boolean => {
  return validateFields(
    {
      name: { ...KonbiniPaymentScheme.name, value: name as string },
      email: { ...KonbiniPaymentScheme.email, value: email as string },
    },
    setInputErrors
  );
};

export const validatePaidyFormFields = ({
  name,
  phone,
  setInputErrors,
}: PaidyValidationFuncProps): boolean => {
  return validateFields(
    {
      name: { ...PaidyPaymentScheme.name, value: name },
      phone: { ...PaidyPaymentScheme.phone, value: phone },
    },
    setInputErrors
  );
};