import {Alert} from 'react-native';
import {SECRET_KEY} from '@env';

const createSession = async (amount: string) => {
  try {
    const url = 'https://komoju.com/api/v1/sessions';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Basic ${btoa(SECRET_KEY + ':')}`,
      },
      body: JSON.stringify({
        default_locale: 'en',
        amount: amount,
        currency: 'USD',
      }),
    };
    const response = await fetch(url, options);
    const {id} = await response.json();

    return id;
  } catch (e) {
    console.warn('Unable to fetch session. Is your server running?');
    Alert.alert('Error', 'Unable to fetch session. Is your server running?');
    return null;
  }
};

export default createSession;
