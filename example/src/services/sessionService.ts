import {Alert} from 'react-native';

// Refer documentation on https://doc.komoju.com/reference/post_sessions
// for creating a session

type createSessionProps = {
  amount: string;
  currency: string;
  secretKey: string;
};

const createSession = async ({
  amount,
  currency,
  secretKey,
}: createSessionProps): Promise<string | null> => {
  try {
    if (!secretKey) {
      console.error('Secret Key Not Found');
      throw new Error('Secret Key Required');
    }

    const url = 'https://komoju.com/api/v1/sessions';
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Basic ${btoa(secretKey + ':')}`,
      },
      body: JSON.stringify({
        default_locale: 'en',
        amount,
        currency,
        return_url: 'komapp://',
      }),
    };
    const response = await fetch(url, options);
    const {id} = await response.json();

    return id;
  } catch (e) {
    Alert.alert(
      'Error',
      'Unable to fetch session. Did you set PUBLIC_KEY and SECRET_KEY at App.tsx?',
    );
    return null;
  }
};

export default createSession;
