// @ts-nocheck

import React, { ReactNode } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";

import CardSection from "../components/sections/CardSection";

import StateProvider from "../context/StateProvider";
import { DispatchContext, StateContext } from "../context/state";
import { PaymentType } from "../util/types";

export const mockState = {
  sessionPay: jest.fn(),
  cardholderName: "John Doe",
  cardCVV: "123",
  cardNumber: "4100000000000100",
  cardExpiredDate: "08 / 25",
  amount: 1000,
  currency: "USD",
};

export const mockDispatch = jest.fn();

export const renderWithContext = (component: ReactNode) => {
  return render(
    <StateContext.Provider value={mockState}>
      <DispatchContext.Provider value={mockDispatch}>
        {component}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

describe("Card Section Test cases", () => {
  test("Cardholder name should be  initially rendered", async () => {
    const { getByText, getByTestId } = render(
      <StateProvider>
        <CardSection />
      </StateProvider>
    );
    const cardHolderText = getByText("CARD_HOLDER_NAME");
    expect(cardHolderText).toBeTruthy();
  });

  test("When enter card holders name state context should capture the card holder name", async () => {
    const { getByText, getByTestId } = render(
      <StateProvider>
        <CardSection />
      </StateProvider>
    );
    fireEvent.changeText(getByText("CARD_HOLDER_NAME"), "Kasun Prabath");
    await waitFor(() =>
      expect(getByTestId("cardHolderName").props.value).toBe("Kasun Prabath")
    );
  });

  it("calls sessionPay with correct parameters on button press", () => {
    const { getByTestId } = renderWithContext(<CardSection />);

    const payButton = getByTestId("PayCTA");

    // Simulate pressing the Pay button
    fireEvent.press(payButton);

    // Check if sessionPay was called with the correct arguments
    expect(mockState.sessionPay).toHaveBeenCalledWith({
      paymentType: PaymentType.CREDIT,
      paymentDetails: {
        cardholderName: mockState.cardholderName,
        cardCVV: mockState.cardCVV,
        cardNumber: mockState.cardNumber,
        cardExpiredDate: mockState.cardExpiredDate,
      },
    });
  });
});
