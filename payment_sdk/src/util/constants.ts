export const noop = () => {};
export const BASE_URL = "https://komoju.com/api/v1";

// redirect url parameter to identify if token validation is completed
export const tokenParameterName = "secure_token_id=";
// redirect url parameter to identify if session payment is completed
export const sessionParameterName = "sessions";

export const paymentSuccessCtaText = "Back to store";
export const paymentFailedCtaText = "Update payment method";

export const emailRegex = /^[a-zA-Z0–9._-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,4}$/;
