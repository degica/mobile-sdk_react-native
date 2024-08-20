// @ts-nocheck

import payForSession from "../services/payForSessionService";
import { PaymentType } from "../util/types";

// Mock the fetch function
global.fetch = jest.fn();

const paymentDetails = {
  publishableKey: "samplepublishablekKey",
  sessionId: "sessionID123",
  paymentType: PaymentType.CREDIT,
  paymentDetails: {
    cardholderName: "John Doe",
    cardNumber: "1234 5678 9012 3456",
    cardExpiredDate: "12/25",
    cardCVV: "123",
  },
};

describe("payForSession", () => {
  test("should successfully process credit card payment", async () => {
    // Mock successful response from the server

    const successPaymentResponse = {
      redirect_url: null,
      status: "completed",
      payment: {
        id: "15xvkc1r4we8g4xjgcrj2ltzd",
        resource: "payment",
        status: "captured",
        amount: 1000,
        tax: 0,
        customer: null,
        payment_deadline: "2024-06-08T14:59:59Z",
        payment_details: {
          type: "credit_card",
          email: null,
          brand: "visa",
          last_four_digits: "0100",
          month: 8,
          year: 2025,
        },
        payment_method_fee: 0,
        total: 1000,
        currency: "JPY",
        description: null,
        captured_at: "2024-06-06T12:56:14Z",
        external_order_num: null,
        metadata: {},
        created_at: "2024-06-06T12:56:14Z",
        amount_refunded: 0,
        locale: "ja",
        session: "6u1jrun2y7fmr8wwu7qskwgov",
        customer_family_name: null,
        customer_given_name: null,
        mcc: null,
        statement_descriptor: null,
        refunds: [],
        refund_requests: [],
      },
    };

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(successPaymentResponse),
    });

    const paymentResponse = await payForSession(paymentDetails);
    expect(paymentResponse).toBe(successPaymentResponse);
  });

  test("should handle network error gracefully", async () => {
    const errorResponse = {
      error: {
        code: "unprocessable_entity",
        message:
          "Validation failed: Payment is invalid, Payment source is invalid, Payment source number is not a valid credit card number",
        param: null,
        details: {},
      },
    };
    // Mock network error response from the server
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(errorResponse),
    });
    const paymentResponse = await payForSession(paymentDetails);
    expect(paymentResponse).toBe(errorResponse);
  });

  // Add more test cases for different scenarios
});
