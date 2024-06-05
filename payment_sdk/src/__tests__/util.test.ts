import { formatCrediCardNumber, formatExpiry } from "../util/helpers";
import { isCardNumberValid, validateCardExpiry } from "../util/validator";

describe("Credit Card number validation", () => {
  it("When a credit card number given this should format the number sepereated with -", () => {
    expect(formatCrediCardNumber("1111111111111111")).toBe(
      "1111-1111-1111-1111"
    );
  });
  it("Given a correct credit card number should return true", () => {
    expect(isCardNumberValid("1111111111111111")).toBeTruthy();
  });

  it("Given a wrong credit card number this should return false", () => {
    expect(isCardNumberValid("111111111111111A")).toBeFalsy();
  });
});

describe("Expiry validation", () => {
  it("Given a expiry date this should return formatted month and year seperated with /", () => {
    expect(formatExpiry("0234", undefined)).toBe("02/34");
  });

  it("Given a correct expiry should return true", () => {
    expect(validateCardExpiry("0234")).toBeTruthy();
  });

  it("Given a  expiry date before current year should return false", () => {
    expect(isCardNumberValid("0204")).toBeFalsy();
  });
});
