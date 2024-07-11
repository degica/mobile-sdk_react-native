import React, { ReactNode } from "react";
import { render, fireEvent } from "@testing-library/react-native";

import { determineCardType, formatCreditCardNumber, formatExpiry } from "../util/helpers";
import { Actions, DispatchContext, StateContext } from "../context/state";
import CardInputGroup from "../components/CardInputGroup";
import { isCardNumberValid, validateCardExpiry } from "../util/validator";

// Mock helper functions
jest.mock("../util/helpers", () => ({
  formatCreditCardNumber: jest.fn(),
  determineCardType: jest.fn(),
  formatExpiry: jest.fn(),
}));

// Mock validate function

jest.mock("../util/validator", () => ({
  isCardNumberValid: jest.fn(),
  validateCardExpiry: jest.fn(),
}));

// Mocked context values
const mockState = {
  cardCVV: "",
  cardNumber: "",
  cardExpiredDate: "",
};

const inputGroupMockValues = {
  number: false,
  expiry: false,
  cvv: false,
};

const mockDispatch = jest.fn();

describe("CardInputGroup Component", () => {
  const renderWithContext = (component: ReactNode) => {
    return render(
      <StateContext.Provider value={mockState}>
        <DispatchContext.Provider value={mockDispatch}>
          {component}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  };

  beforeEach(() => {
    // Clear all mock call history before each test
    jest.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    const { getByTestId } = renderWithContext(
      <CardInputGroup
        inputErrors={inputGroupMockValues}
        resetError={(data: string) => {}}
      />
    );

    // Check if the inputs render with the initial values from context
    expect(getByTestId("cardNumberInput").props.value).toBe(
      mockState.cardNumber
    );
    expect(getByTestId("cardExpiryInput").props.value).toBe(
      mockState.cardExpiredDate
    );
    expect(getByTestId("cardCVVInput").props.value).toBe(mockState.cardCVV);
  });

  it("updates card number when valid and dispatches action", () => {
    isCardNumberValid.mockReturnValue(true);
    formatCreditCardNumber.mockReturnValue("1234 1234 1234 1234");
    determineCardType.mockReturnValue("visa");

    const { getByTestId } = renderWithContext(
      <CardInputGroup
        inputErrors={inputGroupMockValues}
        resetError={(data: string) => {}}
      />
    );

    const cardNumberInput = getByTestId("cardNumberInput");

    // Simulate typing a valid card number
    fireEvent.changeText(cardNumberInput, "1234123412341234");

    // Check if the validation function was called
    expect(isCardNumberValid).toHaveBeenCalledWith("1234123412341234");

    // Check if the dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: Actions.SET_CARD_NUMBER,
      payload: "1234 1234 1234 1234",
    });
  });

  it("does not update card number when invalid", () => {
    isCardNumberValid.mockReturnValue(false);

    const { getByTestId } = renderWithContext(
      <CardInputGroup
        inputErrors={inputGroupMockValues}
        resetError={(data: string) => {}}
      />
    );

    const cardNumberInput = getByTestId("cardNumberInput");

    // Simulate typing an invalid card number
    fireEvent.changeText(cardNumberInput, "1234");

    // Check if the validation function was called
    expect(isCardNumberValid).toHaveBeenCalledWith("1234");

    // Check that dispatch was not called
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("updates card expiry date and dispatches action", () => {
    validateCardExpiry.mockReturnValue(true);
    formatExpiry.mockReturnValue("12 / 25");

    const { getByTestId } = renderWithContext(
      <CardInputGroup
        inputErrors={inputGroupMockValues}
        resetError={(data: string) => {}}
      />
    );

    const cardExpiryInput = getByTestId("cardExpiryInput");

    // Simulate typing a valid expiry date
    fireEvent.changeText(cardExpiryInput, "12/25");

    // Check if the validation function was called
    expect(validateCardExpiry).toHaveBeenCalledWith("12/25");

    // Check if the dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: Actions.SET_CARD_EXPIRED_DATE,
      payload: "12 / 25",
    });
  });

  it("updates card CVV and dispatches action", () => {
    const { getByTestId } = renderWithContext(
      <CardInputGroup
        inputErrors={inputGroupMockValues}
        resetError={(data: string) => {}}
      />
    );

    const cardCVVInput = getByTestId("cardCVVInput");

    // Simulate typing a CVV
    fireEvent.changeText(cardCVVInput, "123");

    // Check if the dispatch was called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: Actions.SET_CARD_CVV,
      payload: "123",
    });
  });
});
