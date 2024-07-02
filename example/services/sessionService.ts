import {Alert} from 'react-native';
import {SECRET_KEY} from '@env';

// Refer documentation on https://doc.komoju.com/reference/post_sessions
// for creating a session

type createSessionProps = {
  amount: string;
  currency: string;
};

const createSession = async ({
  amount,
  currency,
}: createSessionProps): Promise<string | null> => {
  try {
    if (!SECRET_KEY) {
      console.error('Secret Key Not Found');
      throw new Error('Secret Key Required');
    }

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
        amount,
        currency,
      }),
    };
    const response = await fetch(url, options);
    const {id} = await response.json();

    return id;
  } catch (e) {
    Alert.alert('Error', 'Unable to fetch session. Is your server running?');
    return null;
  }
};

export default createSession;
