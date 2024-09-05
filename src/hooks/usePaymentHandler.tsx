import { useContext } from 'react'
import { Alert, Linking } from 'react-native'
import i18next from 'i18next';

import { CreatePaymentFuncType, KomojuProviderIprops, PaymentStatuses, sessionPayProps, TokenResponseStatuses } from '../util/types'
import sessionShow from '../services/sessionShow'
import { validateSessionResponse } from '../util/validator'
import { Actions, DispatchContext } from '../context/state';
import { parsePaymentMethods } from '../util/helpers';
import payForSession from '../services/payForSessionService';

type Props = {
    props: KomojuProviderIprops,
    startLoading: () => void
    stopLoading: () => void
    onPaymentSuccess: () => void
    onPaymentAwaiting: () => void
    onPaymentFailed: () => void
    closePaymentSheet: () => void
}

const usePaymentHandler = ({
    props,
    startLoading,
    stopLoading,
    onPaymentAwaiting,
    onPaymentFailed,
    onPaymentSuccess,
    closePaymentSheet
}: Props) => {
    const dispatch = useContext(DispatchContext);

    // validating the provided session ID by user before proceeding
    const validateSession = async (sessionId: string) => {
        startLoading();

        // Fetching session data from given session ID
        const sessionData = await sessionShow({
            sessionId,
            publishableKey: props.publishableKey,
        });

        // validating the session data and closing the payment gateway if data is not valid
        if (validateSessionResponse(sessionData)) {
            closePaymentSheet();
            Alert.alert('Error', 'Invalid Session');
        } else {
            // if explicitly language is not set. set to the localization from session
            if (props?.language) {
                i18next.changeLanguage(props?.language);
            } else {
                i18next.changeLanguage(sessionData?.default_locale);
            }

            // if session is valid setting amount, currency type at global store for future use
            dispatch({ type: Actions.SET_AMOUNT, payload: sessionData?.amount });
            dispatch({ type: Actions.SET_CURRENCY, payload: sessionData?.currency });

            // if user provided explicitly payments methods via props, will give priority to that over session payment methods
            const paymentMethods = parsePaymentMethods(
                props?.paymentMethods,
                sessionData?.payment_methods
            );

            // setting the payment methods in global state
            dispatch({
                type: Actions.SET_PAYMENT_METHODS,
                payload: paymentMethods,
            });
            // setting the current selected payment method as the first payment method on the list
            dispatch({
                type: Actions.SET_PAYMENT_OPTION,
                payload: paymentMethods ? paymentMethods[0]?.type : '',
            });
        }
        stopLoading();
    };

    // Session pay callback. this method handles all the payment logic and APIs
    const sessionPay = ({ sessionId }: CreatePaymentFuncType) => {
        return async ({ paymentType, paymentDetails }: sessionPayProps) => {
            // Start of the payment handling method
            startLoading();

            // initiate payment for the session ID with payment details
            const response = await payForSession({
                paymentType,
                sessionId,
                publishableKey: props.publishableKey,
                paymentDetails,
            });

            stopLoading();

            if (response?.status === PaymentStatuses.PENDING) {
                openURL(response.redirect_url);
            } else if (response?.status === PaymentStatuses.SUCCESS) {
                if (response?.payment?.status === TokenResponseStatuses.CAPTURED) {
                    onPaymentSuccess();
                } else if (response?.payment?.payment_details?.instructions_url) {
                    openURL(response?.payment?.payment_details?.instructions_url);
                    onPaymentAwaiting();
                }
            } else {
                onPaymentFailed();
            }
        };
    };

    const openURL = async (url: string) => {
        try {
            await Linking.openURL(url);
        } catch (err) {
            Alert.alert('Redirection not working. Please contact support!');
        }
    };

    return {
        sessionPay,
        validateSession
    }
}

export default usePaymentHandler