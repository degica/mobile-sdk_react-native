export type InitPrams = {
  urlScheme: string;
  pubickKey: string;
};

export type createPaymentFuncType = (
  sessionId: string,
  onError: () => {}, // define the callback types here
  onSuccess?: () => {} // define the callback types here
) => {};

export type KomojuContext = {
  createPayment: () => void; // add the types for here
  showPaymentSheetUI: () => void;
  initializeKomoju: (args: InitPrams) => void;
};
