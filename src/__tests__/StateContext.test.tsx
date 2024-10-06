// @ts-nocheck

import { reducer, Actions, KomojuContext } from "../context/state";

import { 
  PaymentType, 
  ResponseScreenStatuses, 
  CurrencyTypes, 
  PaymentMode,
  CardTypes,
  KonbiniType,
  initialState
} from "../util/types";

describe("State Management", () => {
  describe("reducer", () => {

    // Test resetting the state with a new payment type
    it("should handle RESET_STATES", () => {
      const action = {
        type: Actions.RESET_STATES,
        payload: { paymentType: PaymentType.KONBINI },
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        paymentType: PaymentType.KONBINI,
      });
    });

    // Test updating card data in the state
    it("should handle SET_CARD_DATA", () => {
      const action = {
        type: Actions.SET_CARD_DATA,
        payload: { 
          cardNumber: "4111111111111111", 
          cardholderName: "John Doe",
          cardExpiredDate: "12/25",
          cardCVV: "123"
        },
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        cardData: {
          ...initialState.cardData,
          cardNumber: "4111111111111111",
          cardholderName: "John Doe",
          cardExpiredDate: "12/25",
          cardCVV: "123"
        },
      });
    });

    // Test changing the selected payment option
    it("should handle SET_PAYMENT_OPTION", () => {
      const action = {
        type: Actions.SET_PAYMENT_OPTION,
        payload: PaymentType.CREDIT,
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        paymentType: PaymentType.CREDIT,
      });
    });

    // Test setting the name in the state
    it("should handle SET_NAME", () => {
      const action = {
        type: Actions.SET_NAME,
        payload: "Jane Doe",
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        name: "Jane Doe",
      });
    });

    // Test setting the email in the state
    it("should handle SET_EMAIL", () => {
      const action = {
        type: Actions.SET_EMAIL,
        payload: "jane@example.com",
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        email: "jane@example.com",
      });
    });

    // Test updating transfer form fields in the state
    it("should handle SET_TRANSFER_FORM_FIELDS", () => {
      const action = {
        type: Actions.SET_TRANSFER_FORM_FIELDS,
        payload: {
          lastName: "Doe",
          firstName: "John",
          lastNamePhonetic: "ドウ",
          firstNamePhonetic: "ジョン",
          email: "john@example.com",
          phone: "1234567890"
        },
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        transferFormFields: {
          lastName: "Doe",
          firstName: "John",
          lastNamePhonetic: "ドウ",
          firstNamePhonetic: "ジョン",
          email: "john@example.com",
          phone: "1234567890"
        },
      });
    });

    // Test setting the loading state
    it("should handle SET_LOADING", () => {
      const action = {
        type: Actions.SET_LOADING,
        payload: { app: true, payment: false },
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        loading: { app: true, payment: false },
      });
    });

    // Test changing the currency in the state
    it("should handle SET_CURRENCY", () => {
      const action = {
        type: Actions.SET_CURRENCY,
        payload: CurrencyTypes.USD,
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        currency: CurrencyTypes.USD,
      });
    });

    // Test setting the amount in the state
    it("should handle SET_AMOUNT", () => {
      const action = {
        type: Actions.SET_AMOUNT,
        payload: "1000",
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        amount: "1000",
      });
    });

    // Test selecting a store for Konbini payment
    it("should handle SET_SELECTED_STORE", () => {
      const action = {
        type: Actions.SET_SELECTED_STORE,
        payload: KonbiniType.LAWSON,
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        selectedStore: KonbiniType.LAWSON,
      });
    });

    // Test setting the payment state (e.g., success, failure)
    it("should handle SET_PAYMENT_STATE", () => {
      const action = {
        type: Actions.SET_PAYMENT_STATE,
        payload: ResponseScreenStatuses.SUCCESS,
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        paymentState: ResponseScreenStatuses.SUCCESS,
      });
    });

    // Test updating the available payment methods
    it("should handle SET_PAYMENT_METHODS", () => {
      const action = {
        type: Actions.SET_PAYMENT_METHODS,
        payload: [{ type: PaymentType.CREDIT }, { type: PaymentType.KONBINI }],
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        paymentMethods: [{ type: PaymentType.CREDIT }, { type: PaymentType.KONBINI }],
      });
    });

    // Test setting session data in the state
    it("should handle SET_SESSION_DATA", () => {
      const action = {
        type: Actions.SET_SESSION_DATA,
        payload: {
          sessionId: "test-session-id",
          amount: "1000",
          currency: CurrencyTypes.USD,
          paymentMethods: [{ type: PaymentType.CREDIT }],
          mode: PaymentMode.Payment,
        },
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        sessionData: {
          ...initialState.sessionData,
          sessionId: "test-session-id",
          amount: "1000",
          currency: CurrencyTypes.USD,
          paymentMethods: [{ type: PaymentType.CREDIT }],
          mode: PaymentMode.Payment,
        },
      });
    });

    // Test setting provider props data in the state
    it("should handle SET_PROVIDER_PROPS_DATA", () => {
      const action = {
        type: Actions.SET_PROVIDER_PROPS_DATA,
        payload: {
          publishableKey: "test-key",
          paymentMethods: [PaymentType.CREDIT, PaymentType.KONBINI],
          language: "en",
          useBottomSheet: true,
          urlScheme: "myapp://",
        },
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        providerPropsData: {
          publishableKey: "test-key",
          paymentMethods: [PaymentType.CREDIT, PaymentType.KONBINI],
          language: "en",
          useBottomSheet: true,
          urlScheme: "myapp://",
        },
      });
    });

    // Test setting the token ID in the state
    it("should handle SET_TOKEN_ID", () => {
      const action = {
        type: Actions.SET_TOKEN_ID,
        payload: "test-token-id",
      };
      expect(reducer(initialState, action)).toEqual({
        ...initialState,
        tokenId: "test-token-id",
      });
    });
  });

  describe("KomojuContext", () => {
    // Test that KomojuContext has the correct structure
    it("should have the correct shape", () => {
      expect(KomojuContext).toHaveProperty("Provider");
      expect(KomojuContext).toHaveProperty("Consumer");
    });

    // Test that KomojuContext has the correct default values
    it("should have the correct default values", () => {
      const defaultContext = KomojuContext["_currentValue"];
      expect(defaultContext).toHaveProperty("createPayment");
      expect(defaultContext).toHaveProperty("showPaymentSheetUI");
      expect(defaultContext).toHaveProperty("initializeKomoju");
      expect(defaultContext).toHaveProperty("closePaymentSheet");
      expect(typeof defaultContext.createPayment).toBe("function");
      expect(typeof defaultContext.showPaymentSheetUI).toBe("function");
      expect(typeof defaultContext.initializeKomoju).toBe("function");
      expect(typeof defaultContext.closePaymentSheet).toBe("function");
    });
  });
});