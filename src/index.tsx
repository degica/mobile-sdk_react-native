import { useContext } from 'react';

import { KomojuProvider } from './context/KomojuProvider';
import { KomojuContext } from './context/state';

import { LanguageTypes, PaymentType } from './util/types';

/**
 * KomojuSDK provides context utilities for the Komoju payment system.
 */
export const KomojuSDK = {
  /**
   * Custom hook to use the Komoju context in functional components.
   * @returns {object} The Komoju context.
   */
  useKomoju: () => useContext(KomojuContext),
  /**
   * Context consumer component for use in class components.
   */
  komojuConsumer: KomojuContext.Consumer,
  /**
   * Provider component to wrap around the React Native entry point, ensuring the context is available throughout the app.
   */
  KomojuProvider: KomojuProvider,
};

export {
  /**
   * Supported payment types to parse for paymentMethods prop.
   */
  PaymentType as PaymentTypes,
  /**
   * Supported languages to parse for language prop.
   */
  LanguageTypes,
};
