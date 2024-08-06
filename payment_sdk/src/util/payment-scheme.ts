import { emailRegex } from "./constants";
import { ValidationFields } from "./types";
export const validateEmail = (email: string) => {
    return emailRegex.test(email);
};

export const CardPaymentScheme: ValidationFields = {
    name: { value: '', required: true },
    number: { value: '', required: true },
    expiry: { value: '', required: true },
    cvv: { value: '', required: true },
}

export const TransferPaymentScheme: ValidationFields = {
    lastName: { value: '', required: true },
    firstName: { value: '', required: true },
    lastNamePhonetic: { value: '', required: true },
    firstNamePhonetic: { value: '', required: true },
    email: { value: '', required: true, validator: validateEmail },
    phone: { value: '', required: true, }
}

export const KonbiniPaymentScheme: ValidationFields = {
    name: { value: '', required: true },
    email: { value: '', required: true, validator: validateEmail },
}

export const PaidyPaymentScheme: ValidationFields = {
    name: { value: '', required: true },
    phone: { value: '', required: true },
}