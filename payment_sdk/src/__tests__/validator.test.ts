// util/helpers.test.js

import { PaymentStatuses } from "../util/types";
import {
  isCardNumberValid,
  validateCardExpiry,
  validateSessionResponse,
} from "../util/validator";

describe("isCardNumberValid", () => {
  it("returns true for empty input", () => {
    expect(isCardNumberValid("")).toBe(true);
  });

  it("returns false for input exceeding max card length", () => {
    expect(isCardNumberValid("12345678901234567890")).toBe(false);
  });

  it("returns false for input with non-numeric characters", () => {
    expect(isCardNumberValid("1234abcd5678")).toBe(false);
  });

  it("returns true for valid card number input", () => {
    expect(isCardNumberValid("1234 5678 1234 5678")).toBe(true);
  });

  it("returns false for card number with spaces but exceeding max length", () => {
    expect(isCardNumberValid("1234 5678 1234 5678 9012")).toBe(false);
  });

  it("returns false for input length not matching numeric conversion", () => {
    expect(isCardNumberValid("000012341234")).toBe(false);
  });
});

describe("validateCardExpiry", () => {
  it("returns true for empty expiry date", () => {
    expect(validateCardExpiry("")).toBe(true);
  });

  it("returns false for expiry date with invalid month", () => {
    expect(validateCardExpiry("13 / 25")).toBe(false);
  });

  it("returns false for expiry date in the past", () => {
    const pastDate = new Date();
    pastDate.setMonth(pastDate.getMonth() - 1); // One month in the past
    const pastMonth = String(pastDate.getMonth() + 1).padStart(2, "0");
    const pastYear = String(pastDate.getFullYear() % 100).padStart(2, "0");
    expect(validateCardExpiry(`${pastMonth} / ${pastYear}`)).toBe(false);
  });

  it("returns true for valid future expiry date", () => {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1); // One month in the future
    const futureMonth = String(futureDate.getMonth() + 1).padStart(2, "0");
    const futureYear = String(futureDate.getFullYear() % 100).padStart(2, "0");
    expect(validateCardExpiry(`${futureMonth} / ${futureYear}`)).toBe(true);
  });

  it("returns false for expiry date with year more than two digits", () => {
    expect(validateCardExpiry("12 / 2025")).toBe(false);
  });

  it("returns false for expiry date with year exceeding 99", () => {
    expect(validateCardExpiry("12 / 100")).toBe(false);
  });
});

describe("validateSessionResponse", () => {
  it("returns true for null session data", () => {
    expect(validateSessionResponse(null)).toBe(true);
  });

  it("returns true for session data with an error", () => {
    expect(validateSessionResponse({ error: "Some error" })).toBe("Some error");
  });

  it("returns true for expired session data", () => {
    expect(validateSessionResponse({ expired: true })).toBe(true);
  });

  it("returns true for session data with SUCCESS status", () => {
    expect(validateSessionResponse({ status: PaymentStatuses.SUCCESS })).toBe(
      true
    );
  });

  it("returns true for session data with ERROR status", () => {
    expect(validateSessionResponse({ status: PaymentStatuses.ERROR })).toBe(
      true
    );
  });

  it("returns false for session data with any other status", () => {
    expect(validateSessionResponse({ status: "PENDING" })).toBe(false);
  });

  it("returns false for empty object session data", () => {
    expect(validateSessionResponse({})).toBe(false);
  });
});
