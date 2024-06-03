const MAX_CARD_LENGTH = 16;

export const isCardNumberValid = (cardString: string) => {
  const text = cardString.replaceAll("-", "");
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
    const derivedExpiry = expiry.replace("/", "");
    if (derivedExpiry.length > 4) {
      return false;
    }
    const expiryMonthValue = expiry.slice(0, 2);
    const expiryYearValue = expiry.slice(3, 5);
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
